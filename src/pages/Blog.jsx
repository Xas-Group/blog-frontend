import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion"; // For slide-down animation
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Importing icons from React Icons
import styled from "styled-components";
import { getUrl } from "../services/UrlServices";

// Sidebar styled component with custom scrollbar
const Sidebar = styled.div`
  background-color: ${(props) => props.bgColor || "#f8f9fa"};
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
  position: sticky;
  top: 0;

  /* Custom scrollbar styling */
  ::-webkit-scrollbar {
    width: 5px; /* Narrower scrollbar */
  }
  ::-webkit-scrollbar-track {
    background: #e0e0e0; /* Light gray background */
    border-radius: 10px; /* Rounded track */
  }
  ::-webkit-scrollbar-thumb {
    background: #888; /* Darker thumb */
    border-radius: 10px; /* Rounded corners */
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555; /* Darker on hover */
  }

  /* For Firefox */
  scrollbar-width: thin; /* Thin scrollbar */
  scrollbar-color: #888 #e0e0e0; /* Thumb and track color */
`;

const MainTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#d0f0c0" : "transparent")};
  transition: background-color 0.3s;
`;

const SubTitle = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#a8e6cf" : "transparent")};
  transition: background-color 0.3s;
`;

function Blog() {
  const { subjectId } = useParams();
  const [subjectDetail, setSubjectDetail] = useState(null);
  const [expandedMainTitle, setExpandedMainTitle] = useState(null);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // For search functionality

  const fetchSubjects = async () => {
    try {
      const response = await axiosInstance.get(`/subject-details/${subjectId}`);
      if (response.data) {
        const { nav } = response.data;

        // Set default states for the first main title and subtitle
        if (nav.length > 0 && nav[0].subTitle.length > 0) {
          setExpandedMainTitle(nav[0].main_subject_id);
          setSelectedSubtitle(nav[0].subTitle[0].sub_subject_id);
        }

        setSubjectDetail(response.data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [subjectId]);

  if (!subjectDetail) {
    return <div>Loading...</div>;
  }

  const { subject, nav } = subjectDetail;

  // Handle main title click
  const toggleMainTitle = (mainId) => {
    setExpandedMainTitle((prev) => (prev === mainId ? null : mainId));
  };

  // Handle subtitle click
  const handleSubtitleClick = (subtitleId, mainId) => {
    setSelectedSubtitle(subtitleId);
    setExpandedMainTitle(mainId);
  };

  // Filter main titles and subtitles based on search term
  const filteredNav = nav.filter((mainSubject) => {
    const matchesMainTitle = mainSubject.main_subject_title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesSubTitle = mainSubject.subTitle.some((subSubject) =>
      subSubject.sub_subject_title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return matchesMainTitle || matchesSubTitle;
  });

  return (
    <Container fluid>
      <div className="row">
        {/* Sidebar with custom scrollbar */}
        <Sidebar className="col-lg-3 col-xl-2">
          <h5>Subject Overview</h5>
          <img
            src={getUrl(subject.subjectImage)}
            alt={subject.subjectName}
            className="img-fluid mb-2"
          />
          <h4>{subject.subjectName}</h4>
          <p>{subject.subjectDescription}</p>

          {/* Search Box */}
          <div className="mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search main titles or subtitles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Main and Sub Titles */}
          <div className="mt-4">
            {filteredNav.map((mainSubject) => (
              <div key={mainSubject.main_subject_id}>
                <MainTitle
                  active={expandedMainTitle === mainSubject.main_subject_id}
                  onClick={() => toggleMainTitle(mainSubject.main_subject_id)}
                >
                  <span>{mainSubject.main_subject_title}</span>

                  {/* Show down arrow if subtitles are available */}
                  {mainSubject.subTitle.length > 0 && (
                    <span>
                      {expandedMainTitle === mainSubject.main_subject_id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </span>
                  )}
                </MainTitle>

                {/* Slide-down subtitles */}
                {expandedMainTitle === mainSubject.main_subject_id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    {mainSubject.subTitle.map((subSubject) => (
                      <SubTitle
                        key={subSubject.sub_subject_id}
                        active={selectedSubtitle === subSubject.sub_subject_id}
                        onClick={() =>
                          handleSubtitleClick(
                            subSubject.sub_subject_id,
                            mainSubject.main_subject_id
                          )
                        }
                      >
                        {subSubject.sub_subject_title}
                      </SubTitle>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </Sidebar>

        {/* Main Content Area */}
        <div className="col-lg-9 col-xl-10">
          <h5>Content Area</h5>
          {selectedSubtitle ? (
            <div className="mt-3">
              <p>
                <strong>Selected Subtitle ID:</strong> {selectedSubtitle}
              </p>
              <p>
                Content related to the selected subtitle will be displayed here.
              </p>
            </div>
          ) : (
            <p>Select a subtitle to view the content.</p>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Blog;
