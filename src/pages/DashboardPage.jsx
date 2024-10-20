import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Form,
  InputGroup,
  ListGroup,
  Image,
  Dropdown,
  Modal,
} from "react-bootstrap";
import { H1, H4 } from "../Components/Typography";
import { FaExternalLinkAlt, FaPlus, FaSearch } from "react-icons/fa";

function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMainTitle, setSelectedMainTitle] = useState(null);
  const [selectedSubTitle, setSelectedSubTitle] = useState(null);

  const [subjects, setSubjects] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/50",
      title: "Math",
      description: "Basic Math subject",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/50",
      title: "Physics",
      description: "Physics subject",
    },
  ]);

  const [mainTitles, setMainTitles] = useState([
    { id: 1, title: "Algebra", description: "Algebra details", subjectId: 1 },
    { id: 2, title: "Calculus", description: "Calculus details", subjectId: 1 },
    {
      id: 3,
      title: "Quantum Physics",
      description: "Quantum Physics details",
      subjectId: 2,
    },
  ]);

  const [subTitles, setSubTitles] = useState([
    {
      id: 1,
      title: "Linear Equations",
      description: "Linear Equations details",
      mainSubjectId: 1,
    },
    {
      id: 2,
      title: "Differential Equations",
      description: "Differential Equations details",
      mainSubjectId: 2,
    },
    {
      id: 3,
      title: "Wave Theory",
      description: "Wave Theory details",
      mainSubjectId: 3,
    },
  ]);

  // Modal states for Subject, Main Title, and Sub Title
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showMainTitleModal, setShowMainTitleModal] = useState(false);
  const [showSubTitleModal, setShowSubTitleModal] = useState(false);

  // Form data states for each modal
  const [subjectFormData, setSubjectFormData] = useState({});
  const [mainTitleFormData, setMainTitleFormData] = useState({});
  const [subTitleFormData, setSubTitleFormData] = useState({});

  const [isUpdating, setIsUpdating] = useState(false); // To track update mode

  // Common functions
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Filtered lists based on search term
  const filteredSubjects = subjects.filter((subject) =>
    subject.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMainTitles = mainTitles.filter(
    (mainTitle) =>
      mainTitle.subjectId === (selectedSubject ? selectedSubject.id : null) &&
      mainTitle.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubTitles = subTitles.filter(
    (subTitle) =>
      subTitle.mainSubjectId ===
        (selectedMainTitle ? selectedMainTitle.id : null) &&
      subTitle.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal handlers for Subject
  const handleShowSubjectModal = (data = null) => {
    if (data) {
      setSubjectFormData(data); // Pre-fill form for update
      setIsUpdating(true);
    } else {
      setSubjectFormData({}); // Reset form for add
      setIsUpdating(false);
    }
    setShowSubjectModal(true);
  };

  const handleCloseSubjectModal = () => {
    setShowSubjectModal(false);
    setSubjectFormData({});
    setIsUpdating(false);
  };

  const handleSubjectFormChange = (e) => {
    const { name, value } = e.target;
    setSubjectFormData((prevData) => ({ ...prevData, [name]: value }));
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
    if (data) {
      setMainTitleFormData(data);
      setIsUpdating(true);
    } else {
      setMainTitleFormData({});
      setIsUpdating(false);
    }
    setShowMainTitleModal(true);
  };

  const handleCloseMainTitleModal = () => {
    setShowMainTitleModal(false);
    setMainTitleFormData({});
    setIsUpdating(false);
  };

  const handleMainTitleFormChange = (e) => {
    const { name, value } = e.target;
    setMainTitleFormData((prevData) => ({ ...prevData, [name]: value }));
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
    if (data) {
      setSubTitleFormData(data);
      setIsUpdating(true);
    } else {
      setSubTitleFormData({});
      setIsUpdating(false);
    }
    setShowSubTitleModal(true);
  };

  const handleCloseSubTitleModal = () => {
    setShowSubTitleModal(false);
    setSubTitleFormData({});
    setIsUpdating(false);
  };

  const handleSubTitleFormChange = (e) => {
    const { name, value } = e.target;
    setSubTitleFormData((prevData) => ({ ...prevData, [name]: value }));
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

  // Delete function for Subject
  const handleDeleteSubject = () => {
    setSubjects(
      subjects.filter((subject) => subject.id !== subjectFormData.id)
    );
    handleCloseSubjectModal();
  };

  // Delete function for Main Title
  const handleDeleteMainTitle = () => {
    setMainTitles(
      mainTitles.filter((mainTitle) => mainTitle.id !== mainTitleFormData.id)
    );
    handleCloseMainTitleModal();
  };

  // Delete function for Sub Title
  const handleDeleteSubTitle = () => {
    setSubTitles(
      subTitles.filter((subTitle) => subTitle.id !== subTitleFormData.id)
    );
    handleCloseSubTitleModal();
  };

  return (
    <Container className="pt-5">
      <div className="d-flex justify-content-between align-items-center">
        <H1>Dashboard</H1>

        {/* Profile Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle
            id="dropdown-basic"
            className="d-flex align-items-center border-0 p-0 bg-transparent"
            style={{ boxShadow: "none", color: "black" }}
          >
            <Image
              src="https://via.placeholder.com/40"
              roundedCircle
              className="me-2"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
              alt="Profile"
            />
            <span>John Doe</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/view-profile">View Profile</Dropdown.Item>
            <Dropdown.Item>Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <hr />

      {/* Selected Path Display */}
      <div className="mb-4">
        <small className="text-muted">
          {selectedSubject || selectedMainTitle || selectedSubTitle ? (
            <>
              {selectedSubject
                ? `Selected Subject: ${selectedSubject.title} > `
                : ""}
              {selectedMainTitle
                ? `Main Title: ${selectedMainTitle.title} > `
                : ""}
              {selectedSubTitle ? `Sub Title: ${selectedSubTitle.title}` : ""}
            </>
          ) : (
            "No selection made."
          )}
        </small>
      </div>
      <hr className="mb-4" />

      <Row>
        {/* Manage Subject */}
        <Col className="p-3">
          <H4>Manage Subject</H4>
          <hr />
          <Button
            variant="primary"
            className="mb-3 d-flex align-items-center"
            onClick={() => handleShowSubjectModal()}
          >
            <FaPlus className="me-2" /> Add Subject
          </Button>

          <InputGroup className="mb-3">
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

          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <ListGroup>
              {filteredSubjects.map((subject) => (
                <ListGroup.Item
                  key={subject.id}
                  className={`d-flex align-items-start ${
                    selectedSubject && selectedSubject.id === subject.id
                      ? "bg-primary text-white"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onDoubleClick={() => handleShowSubjectModal(subject)}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <Image src={subject.image} rounded className="me-3" />
                  <div>
                    <strong>{subject.title}</strong>
                    <p className="mb-0">{subject.description}</p>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>

        {/* Manage Main Title */}
        <Col className="p-3">
          <H4>Manage Main Title</H4>
          <hr />
          <Button
            variant="primary"
            className="mb-3 d-flex align-items-center"
            onClick={() => handleShowMainTitleModal()}
            disabled={!selectedSubject}
          >
            <FaPlus className="me-2" /> Add Main Title
          </Button>

          <InputGroup className="mb-3">
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

          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <ListGroup>
              {filteredMainTitles.map((mainTitle) => (
                <ListGroup.Item
                  key={mainTitle.id}
                  className={`d-flex align-items-start ${
                    selectedMainTitle && selectedMainTitle.id === mainTitle.id
                      ? "bg-primary text-white"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onDoubleClick={() => handleShowMainTitleModal(mainTitle)}
                  onClick={() => setSelectedMainTitle(mainTitle)}
                >
                  <div>
                    <strong>{mainTitle.title}</strong>
                    <p className="mb-0">{mainTitle.description}</p>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>

        {/* Manage Sub Title */}
        <Col className="p-3">
          <H4>Manage Sub Title</H4>
          <hr />
          <Button
            variant="primary"
            className="mb-3 d-flex align-items-center"
            onClick={() => handleShowSubTitleModal()}
            disabled={!selectedMainTitle}
          >
            <FaPlus className="me-2" /> Add Sub Title
          </Button>

          <InputGroup className="mb-3">
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

          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <ListGroup>
              {filteredSubTitles.map((subTitle) => (
                <ListGroup.Item
                  key={subTitle.id}
                  className={`d-flex align-items-start justify-content-between ${
                    selectedSubTitle && selectedSubTitle.id === subTitle.id
                      ? "bg-primary text-white"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onDoubleClick={() => handleShowSubTitleModal(subTitle)}
                  onClick={() => setSelectedSubTitle(subTitle)}
                >
                  <div>
                    <strong>{subTitle.title}</strong>
                    <p className="mb-0">{subTitle.description}</p>
                  </div>

                  {/* Right button to open new tab */}
                  <Button
                    variant="link"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents triggering the parent click event
                      window.open(`/sub-title/${subTitle.id}`, "_blank");
                    }}
                    className="ms-2"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <FaExternalLinkAlt
                      style={{
                        color:
                          selectedSubTitle &&
                          selectedSubTitle.id === subTitle.id
                            ? "white"
                            : "black",
                      }}
                    />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
      </Row>

      {/* Subject Modal */}
      <Modal show={showSubjectModal} onHide={handleCloseSubjectModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdating ? "Update" : "Add"} Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formSubjectTitle">
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Subject Name"
                name="title"
                value={subjectFormData.title || ""}
                onChange={handleSubjectFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubjectDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                name="description"
                value={subjectFormData.description || ""}
                onChange={handleSubjectFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isUpdating && (
            <Button variant="danger" onClick={handleDeleteSubject}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseSubjectModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubjectFormSubmit}>
            {isUpdating ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Main Title Modal */}
      <Modal show={showMainTitleModal} onHide={handleCloseMainTitleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdating ? "Update" : "Add"} Main Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formMainTitle">
              <Form.Label>Main Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Main Title"
                name="title"
                value={mainTitleFormData.title || ""}
                onChange={handleMainTitleFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMainTitleDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                name="description"
                value={mainTitleFormData.description || ""}
                onChange={handleMainTitleFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isUpdating && (
            <Button variant="danger" onClick={handleDeleteMainTitle}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseMainTitleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleMainTitleFormSubmit}>
            {isUpdating ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sub Title Modal */}
      <Modal show={showSubTitleModal} onHide={handleCloseSubTitleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdating ? "Update" : "Add"} Sub Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formSubTitle">
              <Form.Label>Sub Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Sub Title"
                name="title"
                value={subTitleFormData.title || ""}
                onChange={handleSubTitleFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubTitleDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                name="description"
                value={subTitleFormData.description || ""}
                onChange={handleSubTitleFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isUpdating && (
            <Button variant="danger" onClick={handleDeleteSubTitle}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseSubTitleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubTitleFormSubmit}>
            {isUpdating ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DashboardPage;
