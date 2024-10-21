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
} from "react-bootstrap";
import { H1, H4 } from "../Components/Typography";
import { FaPlus, FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import SubjectModal from "../PageComponents/SubjectModal";
import MainTitleModal from "../PageComponents/MainTitleModal";
import SubSubjectTitleModal from "../PageComponents/SubSubjectTitleModal";
import axiosInstance from "../utils/axiosInstance";
import { getUrl } from "../services/UrlServices";

function DashboardPage() {
  // State for search term
  const [searchTerm, setSearchTerm] = useState("");

  // State for currently selected items
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMainTitle, setSelectedMainTitle] = useState(null);
  const [selectedSubTitle, setSelectedSubTitle] = useState(null);

  // State for showing modals
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showMainTitleModal, setShowMainTitleModal] = useState(false);
  const [showSubTitleModal, setShowSubTitleModal] = useState(false);

  // Form data for each modal
  const [subjectFormData, setSubjectFormData] = useState({});
  const [mainTitleFormData, setMainTitleFormData] = useState({});
  const [subTitleFormData, setSubTitleFormData] = useState({});

  // Update mode state
  const [isUpdating, setIsUpdating] = useState(false);

  // Data arrays for subjects, main titles, and sub-titles
  const [subjects, setSubjects] = useState([]);
  const [mainTitles, setMainTitles] = useState([]);
  const [subTitles, setSubTitles] = useState([]);

  const fetchSubjects = async () => {
    try {
      const response = await axiosInstance.get("/subjects");
      setSubjects(response.data);
      console.log("Subjects fetched successfully.");
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // Fetch main titles based on the selected subject
  const fetchMainTitles = async (subjectId) => {
    try {
      const response = await axiosInstance.get(
        `/main-subject-titles/subject/${subjectId}`
      );
      setMainTitles(response.data);
      console.log("Main Titles fetched successfully.");
    } catch (error) {
      console.error("Error fetching main titles:", error);
    }
  };

  // Fetch sub-titles based on the selected main title
  const fetchSubTitles = async (mainSubjectId) => {
    try {
      const response = await axiosInstance.get(
        `/sub-subject-titles/main-title/${mainSubjectId}`
      );
      setSubTitles(response.data);
      console.log("Sub Titles fetched successfully.");
    } catch (error) {
      console.error("Error fetching sub titles:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchMainTitles(selectedSubject.subjectId); // Fetch main titles based on the selected subject
    } else {
      setMainTitles([]); // Reset if no subject is selected
      setSelectedMainTitle(null); // Reset selected main title
      setSelectedSubTitle(null); // Reset selected sub title
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedMainTitle) {
      fetchSubTitles(selectedMainTitle.main_subject_id); // Fetch sub titles based on the selected main title
    } else {
      setSubTitles([]); // Reset if no main title is selected
      setSelectedSubTitle(null); // Reset selected sub title
    }
  }, [selectedMainTitle]);

  // Search handler
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Filtered lists based on search term
  const filteredSubjects = subjects.filter((subject) =>
    subject?.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMainTitles = mainTitles.filter(
    (mainTitle) =>
      mainTitle.subjectId === (selectedSubject ? selectedSubject.id : null) &&
      mainTitle.main_subject_title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const filteredSubTitles = subTitles.filter(
    (subTitle) =>
      subTitle.mainSubjectId ===
        (selectedMainTitle ? selectedMainTitle.id : null) &&
      subTitle.sub_subject_title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Modal handlers for Subject
  const handleShowSubjectModal = (data = null) => {
    setIsUpdating(!!data);
    setSubjectFormData(data || {});
    setShowSubjectModal(true);
  };

  const handleCloseSubjectModal = () => {
    setShowSubjectModal(false);
    setSubjectFormData({});
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
      <H1>Dashboard</H1>

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
                  src={getUrl(subject.subjectImage)}
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
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
          <ListGroup>
            {filteredMainTitles.map((mainTitle) => (
              <ListGroup.Item
                key={mainTitle.id}
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
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
          <ListGroup>
            {filteredSubTitles.map((subTitle) => (
              <ListGroup.Item
                key={subTitle.id}
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
                </div>
                {/* Open sub-title in a new tab */}
                <Button
                  variant="link"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents triggering the parent click event
                    window.open(
                      `/sub-title/${subTitle.sub_subject_id}`,
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
      />
      <MainTitleModal
        isUpdating={isUpdating}
        showMainTitleModal={showMainTitleModal}
        initialFormData={mainTitleFormData}
        handleCloseMainTitleModal={handleCloseMainTitleModal}
        handleFormSubmit={handleMainTitleFormSubmit}
        selectedSubjectId={selectedSubject?.subjectId}
      />
      <SubSubjectTitleModal
        isUpdating={isUpdating}
        showSubSubjectModal={showSubTitleModal}
        initialFormData={subTitleFormData}
        handleCloseSubSubjectModal={handleCloseSubTitleModal}
        handleFormSubmit={handleSubTitleFormSubmit}
        selectedMainTitleId={selectedMainTitle?.main_subject_id}
      />
    </Container>
  );
}

export default DashboardPage;
