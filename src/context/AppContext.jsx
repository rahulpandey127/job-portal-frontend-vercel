import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

export const AppContextProvider = (props) => {
  //backend url
  let backendUrl = import.meta.env.VITE_BACKEDN_URL;
  let { user } = useUser();
  let { getToken } = useAuth();

  let [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  let [isSearched, setIsSearched] = useState(false);

  let [jobs, setJobs] = useState([]);

  let [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  let [companyToken, setCompanyToken] = useState(null);
  let [companyData, setCompanyData] = useState(null);

  let [userData, setUserData] = useState(null);
  let [userApplications, setUserApplications] = useState([]);
  let [applicants, setApplicants] = useState([]);
  let [status, setStatus] = useState(false);
  //Function to fetch jobs
  const fetchJobs = async () => {
    let { data } = await axios.get(`${backendUrl}/api/jobs/`);
    setJobs(data.jobs);
  };

  //Function to fetch company data
  const fetchCompanyData = async (companyToken) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: {
          token: companyToken,
        },
      });
      if (data.success) {
        setCompanyData(data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData(companyToken);
    }
  }, [companyToken]);

  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
    const token = localStorage.getItem("companyToken");
    if (token) {
      setCompanyToken(token);
    }
  }, []);

  let fetchUserApplications = async () => {
    const token = await getToken();
    try {
      let { data } = await axios.get(`${backendUrl}/api/users/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);
      if (data.success) {
        setUserApplications(data.application);
        setStatus(data.success);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    userData,
    setUserData,
    userApplications,
    fetchUserApplications,
    setUserApplications,
    fetchUserData,
    applicants,
    setApplicants,
    user,
    status,
    setStatus,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
