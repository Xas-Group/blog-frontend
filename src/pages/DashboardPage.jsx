import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Form,
  InputGroup,
  ListGroup,
  Image,
  Breadcrumb,
  Alert,
} from "react-bootstrap";
import { H1, H4 } from "../Components/Typography";
import { FaPlus, FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import SubjectModal from "../PageComponents/SubjectModal";
import MainTitleModal from "../PageComponents/MainTitleModal";
import SubSubjectTitleModal from "../PageComponents/SubSubjectTitleModal";
import axiosInstance from "../utils/axiosInstance";
import { getUrl } from "../services/UrlServices";
import { ToastContainer } from "react-toastify";
import DashboardHeader from "../PageComponents/DashboardHeader";
import AuthService from "../services/authService";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  // State for search term
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMainTitleTerm, setSearchMainTitleTerm] = useState("");
  const [searchSubTitleTerm, setSearchSubTitleTerm] = useState("");

  // State for currently selected items
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMainTitle, setSelectedMainTitle] = useState(null);
  const [selectedSubTitle, setSelectedSubTitle] = useState(null);

  // State for showing modals
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showMainTitleModal, setShowMainTitleModal] = useState(false);
  const [showSubTitleModal, setShowSubTitleModal] = useState(false);

  const user = AuthService.getUserInfo();
  const navigate = useNavigate();

  // Form data for each modal
  const [subjectFormData, setSubjectFormData] = useState({
    id: null,
    subjectName: "",
    subjectDescription: "",
    subjectImage: "",
  });



  const [mainTitleFormData, setMainTitleFormData] = useState({});
  const [subTitleFormData, setSubTitleFormData] = useState({});

  // Update mode state
  const [isUpdating, setIsUpdating] = useState(false);

  // Data arrays for subjects, main titles, and sub-titles
  const [subjects, setSubjects] = useState([]);
  const [mainTitles, setMainTitles] = useState([]);
  const [subTitles, setSubTitles] = useState([]);

  // Error handling state
  const [error, setError] = useState(null);

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const response = await axiosInstance.get("/subjects");
      setSubjects(response.data);
      setMainTitles([]);
      setSubTitles([]);
      setSelectedSubject(null);
      setSelectedMainTitle(null);
      setSelectedSubTitle(null);
      setError(null); // Clear any previous errors
    } catch (error) {
      handleApiError(error, "Error fetching subjects.");
    }
  };

  // Fetch main titles based on the selected subject
  const fetchMainTitles = async (subjectId) => {
    try {
      const response = await axiosInstance.get(
        `/main-subject-titles/subject/${subjectId}`
      );
      setMainTitles(response.data);
      setSubTitles([]);
      setSelectedMainTitle(null);
      setSelectedSubTitle(null);
      setError(null); // Clear any previous errors
    } catch (error) {
      handleApiError(error, "Error fetching main titles.");
    }
  };

  // Fetch sub-titles based on the selected main title
  const fetchSubTitles = async (mainSubjectId) => {
    try {
      const response = await axiosInstance.get(
        `/sub-subject-titles/main-title/${mainSubjectId}`
      );
      setSubTitles(response.data);
      setSelectedSubTitle(null);
      setError(null); // Clear any previous errors
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setSubTitles([]);
        setError("No sub-titles found for the given main subject.");
      } else {
        handleApiError(error, "Error fetching sub-titles.");
      }
    }
  };

  // Error handler
  const handleApiError = (error, message) => {
    console.error(message, error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    setError(errorMessage);
  };

  useEffect(() => {
    console.log(user);
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchMainTitles(selectedSubject.subjectId);
    } else {
      setMainTitles([]);
      setSelectedMainTitle(null);
      setSelectedSubTitle(null);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedMainTitle) {
      fetchSubTitles(selectedMainTitle.main_subject_id);
    } else {
      setSubTitles([]);
      setSelectedSubTitle(null);
    }
  }, [selectedMainTitle]);

  useEffect(() => {
    // Redirect to home if user is null
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Search handler
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleMainTitleSearchChange = (e) => setSearchMainTitleTerm(e.target.value);
  const handleSubTitleSearchChange = (e) => setSearchSubTitleTerm(e.target.value);

  // Filtered lists based on search term
  const filteredSubjects = subjects.filter((subject) =>
    subject?.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMainTitles = mainTitles.filter((mainTitle) =>
    mainTitle.main_subject_title
      .toLowerCase()
      .includes(searchMainTitleTerm.toLowerCase())
  );

  const filteredSubTitles = subTitles.filter((subTitle) =>
    subTitle.sub_subject_title.toLowerCase().includes(searchSubTitleTerm.toLowerCase())
  );

  // Modal handlers for Subject
 const handleShowSubjectModal = (data = {}) => {
   setIsUpdating(!!data.subjectId);
   setSubjectFormData(data);
   setShowSubjectModal(true);
 };


  const handleCloseSubjectModal = () => {
    setShowSubjectModal(false);
    setSubjectFormData(null);
    setIsUpdating(false);
  };

  const handleSubjectFormSubmit = () => {
    if (isUpdating) {
      setSubjects((prevSubjects) =>
        prevSubjects.map((subject) =>
          subject.id === subjectFormData.id ? subjectFormData : subject
        )
      );
    } else {
      const newSubject = {
        id: subjects.length + 1,
        ...subjectFormData,
        image: "https://via.placeholder.com/50",
      };
      setSubjects([...subjects, newSubject]);
    }
    handleCloseSubjectModal();
  };

  // Modal handlers for Main Title
  const handleShowMainTitleModal = (data = null) => {
    setIsUpdating(!!data);
    setMainTitleFormData(data || {});
    setShowMainTitleModal(true);
  };

  const handleCloseMainTitleModal = () => {
    setShowMainTitleModal(false);
    setMainTitleFormData({});
    setIsUpdating(false);
  };

  const handleMainTitleFormSubmit = () => {
    if (isUpdating) {
      setMainTitles((prevMainTitles) =>
        prevMainTitles.map((mainTitle) =>
          mainTitle.id === mainTitleFormData.id ? mainTitleFormData : mainTitle
        )
      );
    } else {
      const newMainTitle = {
        id: mainTitles.length + 1,
        ...mainTitleFormData,
        subjectId: selectedSubject.id,
      };
      setMainTitles([...mainTitles, newMainTitle]);
    }
    handleCloseMainTitleModal();
  };

  // Modal handlers for Sub Title
  const handleShowSubTitleModal = (data = null) => {
    setIsUpdating(!!data);
    setSubTitleFormData(data || {});
    setShowSubTitleModal(true);
  };

  const handleCloseSubTitleModal = () => {
    setShowSubTitleModal(false);
    setSubTitleFormData({});
    setIsUpdating(false);
  };

  const handleSubTitleFormSubmit = () => {
    if (isUpdating) {
      setSubTitles((prevSubTitles) =>
        prevSubTitles.map((subTitle) =>
          subTitle.id === subTitleFormData.id ? subTitleFormData : subTitle
        )
      );
    } else {
      const newSubTitle = {
        id: subTitles.length + 1,
        ...subTitleFormData,
        mainSubjectId: selectedMainTitle.id,
      };
      setSubTitles([...subTitles, newSubTitle]);
    }
    handleCloseSubTitleModal();
  };

  // When a subject is selected, reset the main title and sub title
  const handleSubjectSelection = (subject) => {
    setSelectedSubject(subject);
    setSelectedMainTitle(null);
    setSelectedSubTitle(null);
  };

  // When a main title is selected, reset the sub title
  const handleMainTitleSelection = (mainTitle) => {
    setSelectedMainTitle(mainTitle);
    setSelectedSubTitle(null);
  };

  return (
    <Container className="pt-5">
      <DashboardHeader userName={user?.name} userImage={user?.profileImage} />

      {/* Display error message */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Breadcrumb for showing current selection */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item
          active={!selectedSubject}
          onClick={() => {
            setSelectedSubject(null);
            setSelectedMainTitle(null);
            setSelectedSubTitle(null);
          }}
        >
          Subjects
        </Breadcrumb.Item>
        {selectedSubject && (
          <Breadcrumb.Item
            active={!selectedMainTitle}
            onClick={() => {
              setSelectedMainTitle(null);
              setSelectedSubTitle(null);
            }}
          >
            {selectedSubject.subjectName}
          </Breadcrumb.Item>
        )}
        {selectedMainTitle && (
          <Breadcrumb.Item
            active={!selectedSubTitle}
            onClick={() => setSelectedSubTitle(null)}
          >
            {selectedMainTitle.main_subject_title}
          </Breadcrumb.Item>
        )}
        {selectedSubTitle && (
          <Breadcrumb.Item active>
            {selectedSubTitle.sub_subject_title}
          </Breadcrumb.Item>
        )}
      </Breadcrumb>

      <Row>
        {/* Manage Subject */}
        <Col className="p-3">
          <H4>Manage Subject</H4>
          <Button variant="primary" onClick={() => handleShowSubjectModal()}>
            <FaPlus className="me-2" /> Add Subject
          </Button>
          <InputGroup className="mt-3 mb-3">
            <Form.Control
              type="text"
              placeholder="Search Subject"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
          <ListGroup>
            {filteredSubjects.map((subject) => (
              <ListGroup.Item
                key={subject.subjectId}
                onClick={() => handleSubjectSelection(subject)}
                onDoubleClick={() => handleShowSubjectModal(subject)}
                className={`d-flex align-items-start ${
                  selectedSubject &&
                  selectedSubject.subjectId === subject.subjectId
                    ? "bg-primary text-white"
                    : ""
                }`}
              >
                <Image
                  src={
                    subject.subjectImage
                      ? getUrl(subject.subjectImage)
                      : "https://placehold.co/50x50"
                  }
                  rounded
                  className="me-3"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <div>
                  <strong>{subject.subjectName}</strong>
                  <p className="mb-0">{subject.subjectDescription}</p>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Manage Main Title */}
        <Col className="p-3">
          <H4>Manage Main Title</H4>
          <Button
            variant="primary"
            onClick={() => handleShowMainTitleModal()}
            disabled={!selectedSubject}
          >
            <FaPlus className="me-2" /> Add Main Title
          </Button>
          <InputGroup className="mt-3 mb-3">
            <Form.Control
              type="text"
              placeholder="Search Main Title"
              value={searchMainTitleTerm}
              onChange={handleMainTitleSearchChange}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
          <ListGroup>
            {filteredMainTitles.map((mainTitle) => (
              <ListGroup.Item
                key={mainTitle.main_subject_id}
                onClick={() => handleMainTitleSelection(mainTitle)}
                onDoubleClick={() => handleShowMainTitleModal(mainTitle)}
                className={`d-flex align-items-start ${
                  selectedMainTitle &&
                  selectedMainTitle.main_subject_id ===
                    mainTitle.main_subject_id
                    ? "bg-primary text-white"
                    : ""
                }`}
              >
                <div>
                  <strong>{mainTitle.main_subject_title}</strong>
                  <p className="mb-0">{mainTitle.main_subject_short_title}</p>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Manage Sub Title */}
        <Col className="p-3">
          <H4>Manage Sub Title</H4>
          <Button
            variant="primary"
            onClick={() => handleShowSubTitleModal()}
            disabled={!selectedMainTitle}
          >
            <FaPlus className="me-2" /> Add Sub Title
          </Button>
          <InputGroup className="mt-3 mb-3">
            <Form.Control
              type="text"
              placeholder="Search Sub Title"
              value={searchSubTitleTerm}
              onChange={handleSubTitleSearchChange}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
          <ListGroup>
            {filteredSubTitles.map((subTitle) => (
              <ListGroup.Item
                key={subTitle.sub_subject_id}
                onClick={() => setSelectedSubTitle(subTitle)}
                onDoubleClick={() => handleShowSubTitleModal(subTitle)}
                className={`d-flex align-items-start justify-content-between ${
                  selectedSubTitle &&
                  selectedSubTitle.sub_subject_id === subTitle.sub_subject_id
                    ? "bg-primary text-white"
                    : ""
                }`}
              >
                <div>
                  <strong>{subTitle.sub_subject_title}</strong>
                  <p className="mb-0">{subTitle.sub_subject_short_title}</p>
                </div>
                <Button
                  variant="link"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents triggering the parent click event
                    window.open(
                      `/blog-frontend/pageComponent/${subTitle.sub_subject_id}`,
                      "_blank"
                    );
                  }}
                  className="ms-2"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <FaExternalLinkAlt />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      {/* Modals */}
      <SubjectModal
        isUpdating={isUpdating}
        showSubjectModal={showSubjectModal}
        initialFormData={subjectFormData}
        handleCloseSubjectModal={handleCloseSubjectModal}
        handleFormSubmit={handleSubjectFormSubmit}
        refreshSubjectsList={fetchSubjects}
        selectedSubjectId={selectedSubject?.subjectId}
      />
      <MainTitleModal
        isUpdating={isUpdating}
        showMainTitleModal={showMainTitleModal}
        initialFormData={mainTitleFormData}
        handleCloseMainTitleModal={handleCloseMainTitleModal}
        handleFormSubmit={handleMainTitleFormSubmit}
        selectedSubjectId={selectedSubject?.subjectId}
        selectedMainTitleId={selectedMainTitle?.main_subject_id}
        refreshMainTitlesList={() => fetchMainTitles(selectedSubject.subjectId)}
      />
      <SubSubjectTitleModal
        isUpdating={isUpdating}
        showSubSubjectModal={showSubTitleModal}
        initialFormData={subTitleFormData}
        handleCloseSubSubjectModal={handleCloseSubTitleModal}
        handleFormSubmit={handleSubTitleFormSubmit}
        selectedMainTitleId={selectedMainTitle?.main_subject_id}
        selectedSubTitleId={selectedSubTitle?.sub_subject_id}
        refreshSubSubjectsList={() =>
          fetchSubTitles(selectedMainTitle.main_subject_id)
        }
      />
    </Container>
  );
}

export default DashboardPage;
