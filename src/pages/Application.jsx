import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { assets, jobsApplied } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import Loading from "../components/Loading";

const Application = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const {
    companyToken,
    userData,
    backendUrl,
    fetchUserData,
    userApplications,
    setApplicants,
    status,
  } = useContext(AppContext);
  const { user } = useUser();
  const { getToken } = useAuth();

  let uploadResume = async () => {
    const token = await getToken();

    let formData = new FormData();
    formData.append("resume", resume);

    try {
      let { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (data.success) {
        await fetchUserData();

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsEdit(true);
    setResume(null);
  };

  let fetchCompnayJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken },
      });

      if (data.success) {
        setApplicants(data.applications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCompnayJobApplications();
      fetchUserData();
    }
  }, [user]);
  // console.log("status" + status);
  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit || (userData && userData?.resume === "") ? (
            <>
              <label htmlFor="resumeUpload" className="flex items-center">
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2 ">
                  {resume ? resume.name : "Select Resume"}
                </p>
                <input
                  id="resumeUpload"
                  accept="application/pdf"
                  type="file"
                  hidden
                  name="resume"
                  onChange={(e) => {
                    setResume(e.target.files[0]);
                  }}
                />
                <img src={assets.profile_upload_icon} alt="profile-image" />
              </label>
              <button
                className="bg-green-100 border border-green-400 rounded-lg px-4 py-2"
                onClick={() => {
                  uploadResume();
                }}
              >
                Save
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                href={userData?.resume}
                target="_blank"
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
              >
                Resume
              </a>
              <button
                className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        {userApplications.length === 0 ? (
          <div className="w-full h-[40vh] flex justify-center">
            <h2 className="text-2xl font-semibold">No Jobs Applied</h2>
          </div>
        ) : status ? (
          <>
            {" "}
            <>
              <table className="min-w-full border rounded-lg">
                <thead>
                  <tr>
                    <th className="py-3 px-4 border-b text-left">Company</th>
                    <th className="py-3 px-4 border-b text-left">Job Title</th>
                    <th className="py-3 px-4 border-b text-left max-sm:hidden">
                      Location
                    </th>
                    <th className="py-3 px-4 border-b text-left max-sm:hidden">
                      Date
                    </th>
                    <th className="py-3 px-4 border-b text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userApplications.map((job, index) =>
                    status ? (
                      <tr>
                        <td className="py-3 px-4 flex items-center gap-2 border-b">
                          <img
                            src={job?.companyId?.image}
                            alt="logo"
                            className="w-8 h-8"
                          />
                          {job?.companyId?.name}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {job?.jobId?.title}
                        </td>
                        <td className="py-2 px-4 border-b max-sm:hidden">
                          {job?.jobId?.location}
                        </td>
                        <td className="py-2 px-4 border-b max-sm:hidden">
                          {moment(job?.date).format("DD-MM-YYYY")}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <span
                            className={`${job.status === "Accepted" ? "bg-green-100" : job.status === "Rejected" ? "bg-red-100" : "bg-blue-100"} px-4 py-1.5 rounded`}
                          >
                            {job?.status}
                          </span>
                        </td>
                      </tr>
                    ) : null,
                  )}
                </tbody>
              </table>
            </>
          </>
        ) : (
          <>
            <div className=" h-[10vh] flex justify-between w-20 mx-auto my-20">
              <TailSpin />
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Application;
