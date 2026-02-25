import React, { useContext, useEffect, useState } from "react";
import { assets, viewApplicationsPageData } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
// import jobApplication from "../../../server/models/jobApplication";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);

  const [applicants, setApplicants] = useState([]);

  const fetchCompnayJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken },
      });
      console.log(data);
      if (data.success) {
        setApplicants(data?.applications?.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompnayJobApplications();
    }
  }, [companyToken]);

  const viewResume = (url, username) => {
    const downloadUrl = url.replace(
      "/upload/",
      `/upload/fl_attachment:${username}/`,
    );
    window.open(downloadUrl, "_blank"); // new tab me open karega
  };

  let changeApplicationStatus = async (id, status) => {
    try {
      let { data } = await axios.put(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        {
          headers: { token: companyToken },
        },
      );

      if (data.success) {
        toast.success(data?.message);
        fetchCompnayJobApplications();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      {applicants.length == 0 ? (
        <div className="w-full flex justify-center items-center h-[90vh]">
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            visible={true}
          />
        </div>
      ) : (
        <>
          <div className="container mx-auto p-4">
            <div>
              <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm ">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">#</th>
                    <th className="py-2 px-12 text-left">User name</th>
                    <th className="py-2 px-12 text-left max-sm:hidden">
                      Job Title
                    </th>
                    <th className="py-2 px-4 text-left max-sm:hidden:">
                      Location
                    </th>
                    <th className="py-2 px-4 text-left">Resume</th>
                    <th className="py-2 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {applicants?.map((item, index) => {
                      return (
                        <tr key={index} className="text-gray-700">
                          <td className="py-2 px-4 border-b text-center">
                            {index + 1}
                          </td>
                          <td className="py-2 px-4 border-b text-center flex h-14 ">
                            <img
                              src={item?.userId?.image}
                              alt="pic"
                              className="w-8  h-8 rounded-full mr-3 max-sm:hidden"
                            />
                            <span className="my-2"> {item?.userId?.name}</span>
                          </td>
                          <td className="py-2 px-4 border-b text-center max-sm:hidden">
                            {item?.jobId?.title}
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            {item?.jobId?.location}
                          </td>
                          <td className=" px-4 border-b flex justify-between w-30 bg-blue-100 ">
                            <a
                              href={item?.userId?.resume}
                              target="_blank"
                              className="py-2"
                            >
                              Resume
                            </a>

                            <button
                              onClick={() =>
                                viewResume(
                                  item?.userId?.resume,
                                  item?.userId?.name,
                                )
                              }
                              className=" px-2 py-3 "
                            >
                              <img
                                src={assets.resume_download_icon}
                                alt="icon"
                              />
                            </button>
                          </td>
                          <td className="py-2 px-4 border-b relative">
                            {item.status === "Pending" ? (
                              <div className="relative inline-block text-left group">
                                <button className="text-gray-500 action-button">
                                  ...
                                </button>
                                <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                                    onClick={() =>
                                      changeApplicationStatus(
                                        item._id,
                                        "Accepted",
                                      )
                                    }
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                    onClick={() =>
                                      changeApplicationStatus(
                                        item._id,
                                        "Rejected",
                                      )
                                    }
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-500">{item.status}</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ViewApplications;
