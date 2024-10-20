import { useState } from "react";
import { Col, ListGroup, Button, Form, InputGroup } from "react-bootstrap";
import { FaPlus, FaSearch } from "react-icons/fa";

function MainTitles({
  mainTitles,
  setMainTitles,
  selectedSubject,
  selectedMainTitle,
  setSelectedMainTitle,
  handleShowModal,
  searchTerm,
  setSearchTerm,
}) {
  const filteredMainTitles = mainTitles.filter(
    (mainTitle) =>
      mainTitle.subjectId === (selectedSubject ? selectedSubject.id : null) &&
      mainTitle.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Col className="p-3">
      <h4>Manage Main Title</h4>
      <hr />
      <Button
        variant="primary"
        className="mb-3 d-flex align-items-center"
        onClick={() => handleShowModal("mainTitle")}
        disabled={!selectedSubject}
      >
        <FaPlus className="me-2" /> Add Main Title
      </Button>

      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search Main Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
              onDoubleClick={() => handleShowModal("mainTitle", mainTitle)}
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
  );
}

export default MainTitles;
