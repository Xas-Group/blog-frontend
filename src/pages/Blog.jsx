import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Image,
  Button,
  Offcanvas,
  Spinner,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom"; 
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaBars, FaArrowUp } from "react-icons/fa";
import styled from "styled-components";
import { getUrl } from "../services/UrlServices";
import RowComponent from "../BlogComponents/RowComponent";
import BlogComponent from "../BlogComponents/BlogComponent";

// Hook to detect mobile screen size
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992); // Mobile if screen width < 992px
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

// Styled components
const Sidebar = styled.div`
  background-color: ${(props) => props.bgColor || "#f8f9fa"};
  padding: 20px;
  height: 100%;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: #e0e0e0;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  scrollbar-width: thin;
  scrollbar-color: #888 #e0e0e0;
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

const ScrollTopButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  height: 40px;
  width: 40px;
  line-height: 30px;
  display: ${(props) => (props.visible ? "block" : "none")};
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s;
  &:hover {
    background-color: #0056b3;
  }
`;

// Styled components for the error message and back button
const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const ErrorMessage = styled.h2`
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

const BackButton = styled(Button)`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  &:hover {
    background-color: #0056b3;
  }
`;

function Blog() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subjectDetail, setSubjectDetail] = useState(null);
  const [expandedMainTitle, setExpandedMainTitle] = useState(null);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageComponents, setPageComponents] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [isInvalidSubject, setIsInvalidSubject] = useState(false); // State for invalid subject
  const isMobile = useIsMobile();

  const fetchSubjects = async () => {
    setLoadingSubject(true);
    try {
      const response = await axiosInstance.get(`/subject-details/${subjectId}`);
      if (response.data) {
        const { nav } = response.data;

        // If subjectId is valid, set states accordingly
        if (nav.length > 0) {
          setIsInvalidSubject(false);

          if (nav[0].subTitle.length > 0) {
            setExpandedMainTitle(nav[0].main_subject_id);
            setSelectedSubtitle(nav[0].subTitle[0].sub_subject_id);
          }

          setSubjectDetail(response.data);
        } else {
          // Invalid subjectId
          setIsInvalidSubject(true);
        }
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setIsInvalidSubject(true);
    } finally {
      setLoadingSubject(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [subjectId]);

  const fetchPageComponents = async (selectedSubtitle) => {
    setLoadingContent(true);
    try {
      const response = await axiosInstance.get(
        `/blog/${selectedSubtitle}/page-components`
      );
      if (response.data) {
        const { pageComponents } = response.data;
        setPageComponents(pageComponents);
      }
    } catch (error) {
      console.error("Error fetching page components:", error);
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    if (selectedSubtitle) {
      fetchPageComponents(selectedSubtitle);
    }
  }, [selectedSubtitle]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Navigate back function
  const goBack = () => {
    navigate(-1);
  };

  // Show loading spinner if subject is being fetched
  if (loadingSubject) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Show error message if subjectId is invalid
  if (isInvalidSubject) {
    return (
      <MessageContainer>
        <ErrorMessage>
          The subject you are looking for does not exist or has been removed.
        </ErrorMessage>
        <BackButton onClick={goBack}>Go Back</BackButton>
      </MessageContainer>
    );
  }

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
    if (isMobile) setShowOffcanvas(false); // Close sidebar on subtitle click for mobile
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <Row>
        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="mt-4 d-flex justify-content-end">
            <Button
              variant="secondary"
              className="mb-3"
              onClick={() => setShowOffcanvas(true)}
            >
              <FaBars /> Menu
            </Button>
          </div>
        )}

        {/* Sidebar */}
        {!isMobile ? (
          <Col lg={3} xl={2} >
            <Sidebar>
              <h5 className="text-center mb-3">Subject Overview</h5>
              <Image
                src={getUrl(subject.subjectImage)}
                alt={subject.subjectName}
                fluid
                className="mb-2 mx-auto d-block"
              />
              <h4 className="text-center">{subject.subjectName}</h4>
              <p className="text-center">{subject.subjectDescription}</p>

              {/* Search Box */}
              <InputGroup className="mt-3">
                <FormControl
                  type="text"
                  placeholder="Search main titles or subtitles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              {/* Main and Sub Titles */}
              <div className="mt-4">
                {filteredNav.map((mainSubject) => (
                  <div key={mainSubject.main_subject_id}>
                    <MainTitle
                      active={expandedMainTitle === mainSubject.main_subject_id}
                      onClick={() =>
                        toggleMainTitle(mainSubject.main_subject_id)
                      }
                    >
                      <span>{mainSubject.main_subject_title}</span>

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

                    {expandedMainTitle === mainSubject.main_subject_id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        {mainSubject.subTitle.map((subSubject) => (
                          <SubTitle
                            key={subSubject.sub_subject_id}
                            active={
                              selectedSubtitle === subSubject.sub_subject_id
                            }
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
          </Col>
        ) : (
          <Offcanvas
            show={showOffcanvas}
            onHide={() => setShowOffcanvas(false)}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Sidebar>
                <h5 className="text-center mb-3">Subject Overview</h5>
                <Image
                  src={getUrl(subject.subjectImage)}
                  alt={subject.subjectName}
                  fluid
                  className="mb-2 mx-auto d-block"
                />
                <h4 className="text-center">{subject.subjectName}</h4>
                <p className="text-center">{subject.subjectDescription}</p>

                {/* Search Box */}
                <InputGroup className="mt-3">
                  <FormControl
                    type="text"
                    placeholder="Search main titles or subtitles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>

                {/* Main and Sub Titles */}
                <div className="mt-4">
                  {filteredNav.map((mainSubject) => (
                    <div key={mainSubject.main_subject_id}>
                      <MainTitle
                        active={
                          expandedMainTitle === mainSubject.main_subject_id
                        }
                        onClick={() =>
                          toggleMainTitle(mainSubject.main_subject_id)
                        }
                      >
                        <span>{mainSubject.main_subject_title}</span>

                        {mainSubject.subTitle.length > 0 && (
                          <span>
                            {expandedMainTitle ===
                            mainSubject.main_subject_id ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </span>
                        )}
                      </MainTitle>

                      {expandedMainTitle === mainSubject.main_subject_id && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          {mainSubject.subTitle.map((subSubject) => (
                            <SubTitle
                              key={subSubject.sub_subject_id}
                              active={
                                selectedSubtitle === subSubject.sub_subject_id
                              }
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
            </Offcanvas.Body>
          </Offcanvas>
        )}

        {/* Main Content Area */}
        <Col lg={9} xl={10} className="mt-4 mb-5">
          {loadingContent ? (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : selectedSubtitle ? (
            pageComponents.map((component, i) => {
              const { row_status } = component;

              return row_status === "row" ? (
                <RowComponent key={i} RowObject={component} />
              ) : (
                <BlogComponent key={i} pageComponent={component} />
              );
            })
          ) : (
            <p className="text-center mt-4">
              Select a subtitle to view the content.
            </p>
          )}
        </Col>
      </Row>

      {/* Scroll to Top Button */}
      <ScrollTopButton visible={showScrollTop} onClick={scrollToTop}>
        <FaArrowUp />
      </ScrollTopButton>
    </Container>
  );
}

export default Blog;
