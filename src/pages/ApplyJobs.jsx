import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { assets, jobsData } from "../assets/assets";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
const ApplyJobs = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [jobData, setJobData] = useState({});
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const {
    userData,
    jobs,
    backendUrl,
    userApplications,
    fetchUserApplications,
  } = useContext(AppContext);
  const { getToken } = useAuth();

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);

      if (data.success) {
        setJobData(data.job);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  let applyForJob = async () => {
    try {
      if (!userData) {
        return toast.error("Please login to apply for job");
      }

      if (!userData.resume) {
        navigate("/applications");
        return toast.error("Upload resume to apply");
      }
      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { userId: userData._id, jobId: jobData._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        fetchUserApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(
      (item) => item.jobId._id === jobData._id,
    );
    console.log(hasApplied);
    setIsAlreadyApplied(hasApplied);
  };

  useEffect(() => {
    if (userApplications.length > 0 && jobsData) {
      checkAlreadyApplied();
    }
  }, [jobsData, userApplications, id]);
  return jobsData ? (
    <>
      <Navbar />
      <div className="min-h-screen flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 ">
            <div className="flex flex-col md:flex-row items-center ">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                src={jobData?.companyId?.image}
                alt="logo"
              />
              <div className="text-center md:text-left text-neutral-700 ">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {jobData?.title}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-6 items-center text-gray-600 mt-2 ">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="suitcase" />
                    {jobData?.companyId?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="location" />
                    {jobData?.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="calendar" />
                    {jobData?.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="calendar" />
                    CTC: {kconvert.convertTo(jobData?.salary)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button
                className="bg-blue-600 p-2.5 px-10 text-white rounded"
                onClick={() => {
                  applyForJob();
                }}
              >
                {isAlreadyApplied ? "Already Applied" : "Apply Now"}
              </button>
              <p className="mt-1 text-gray-600">
                Posted {moment(jobData?.date).fromNow()}
              </p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4">Job description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              ></div>
              <button
                className="bg-blue-600 p-2.5 px-10 text-white rounded mt-10"
                onClick={() => {
                  applyForJob();
                }}
              >
                {isAlreadyApplied ? "Already Applied" : "Apply Now"}
              </button>
            </div>
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More jobs from {jobData?.companyId?.name}</h2>
              {jobs
                .filter((job) => job._id !== jobData._id)
                .filter((job) =>
                  //Set of job ids
                  {
                    const appliedJobIds = new Set(
                      userApplications.map(
                        (item) => item.jobId._id && item.jobId._id,
                      ),
                    );

                    //Return true if user not applied for this job
                    return !appliedJobIds.has(job._id);
                  },
                )
                .slice(0, 3)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJobs;
