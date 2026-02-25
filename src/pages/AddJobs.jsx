import { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
const AddJobs = () => {
  let [title, setTitle] = useState("");
  let [location, setLocation] = useState("Bangalore");
  let [category, setCategory] = useState("Programming");
  let [level, setLevel] = useState("Beginner level");
  let [salary, setSalary] = useState("0");
  let editorRef = useRef(null);
  let quillRef = useRef(null);
  const { backendUrl, companyToken } = useContext(AppContext);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const description = quillRef.current.root.innerHTML;

      let { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        {
          title,
          location,
          category,
          level,
          salary,
          description,
        },
        {
          headers: {
            token: companyToken,
          },
        },
      );
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setSalary("0");
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // quillRef.current = new Quill(editorRef.current, {
    //   theme: "snow",
    //   modules: {
    //     toolbar: [
    //       ["bold", "italic", "underline", "strike"],
    //       ["blockquote", "code-block"],
    //       [{ header: 1 }, { header: 2 }],
    //       [{ list: "ordered" }, { list: "bullet" }],
    //       [{ script: "sub" }, { script: "super" }],
    //       [{ indent: "-1" }, { indent: "+1" }],
    //       ["direction", { align: [] }],
    //     ],
    //   },
    // });

    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);
  return (
    <form
      className="container p-4 flex flex-col w-full items-start gap-3"
      onSubmit={onSubmitHandler}
    >
      <div className="w-full ">
        <p className="mb-2">Job Title</p>
        <input
          type="text"
          placeholder="Type here.."
          onChange={(e) => setTitle(e.target.value)}
          className="w-full max-w-lg px-3 py-2 border-2 border-gray--300 rounded"
          value={title}
        />
      </div>
      <div className="w-full max-w-lg">
        <p className="my-2">Job Description</p>
        <div ref={editorRef}></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8 ">
        <div>
          <p className="mb-2">Job Category</p>
          <select
            onClick={(e) => setCategory(e.target.value)}
            className="w-full px-2 py-2 border-2 border-gray-300 rounded"
          >
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Job Location</p>
          <select
            onClick={(e) => setLocation(e.target.value)}
            className="w-full px-2 py-2 border-2 border-gray-300 rounded"
          >
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Job Level</p>
          <select
            onClick={(e) => setLevel(e.target.value)}
            className="w-full px-2 py-2 border-2 border-gray-300 rounded"
          >
            <option value="Beginner Level">Beginner Level</option>
            <option value="Intermediate Level">Intermediate Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>
      </div>

      <div className="mb-2">
        <p>Job Salary</p>
        <input
          type="number"
          min={0}
          placeholder="2500"
          onChange={(e) => setSalary(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"
        />
      </div>

      <button className="w-28 py-3 mt-4 bg-black text-white rounded">
        ADD
      </button>
    </form>
  );
};

export default AddJobs;
