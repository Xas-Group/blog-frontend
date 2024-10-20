import { useState } from "react";
import { Col, ListGroup, Button, Form, InputGroup } from "react-bootstrap";
import { FaPlus, FaSearch, FaExternalLinkAlt } from "react-icons/fa";

function SubTitles({
  subTitles,
  setSubTitles,
  selectedMainTitle,
  selectedSubTitle,
  setSelectedSubTitle,
  handleShowModal,
  searchTerm,
  setSearchTerm,
}) {
  const filteredSubTitles = subTitles.filter(
    (subTitle) =>
      subTitle.mainSubjectId ===
        (selectedMainTitle ? selectedMainTitle.id : null) &&
      subTitle.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Col className="p-3">
      <h4>Manage Sub Title</h4>
      <hr />
      <Button
        variant="primary"
        className="mb-3 d-flex align-items-center"
        onClick={() => handleShowModal("subTitle")}
        disabled={!selectedMainTitle}
      >
        <FaPlus className="me-2" /> Add Sub Title
      </Button>

      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search Sub Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
              onDoubleClick={() => handleShowModal("subTitle", subTitle)}
              onClick={() => setSelectedSubTitle(subTitle)}
            >
              <div>
                <strong>{subTitle.title}</strong>
                <p className="mb-0">{subTitle.description}</p>
              </div>

              <Button
                variant="link"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/sub-title/${subTitle.id}`, "_blank");
                }}
                className="ms-2"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FaExternalLinkAlt
                  style={{
                    color:
                      selectedSubTitle && selectedSubTitle.id === subTitle.id
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
  );
}

export default SubTitles;
