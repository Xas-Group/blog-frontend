import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {
  Button,
  Container,
  Modal,
  Form,
  Alert,
  Image,
  Card,
  Spinner,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import Select from "react-select";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { getUrl } from "../services/UrlServices";
import Swal from "sweetalert2";

const componentTypeOptions = [
  { value: "h1", label: "H1" },
  { value: "h2", label: "H2" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "p", label: "Paragraph" },
  { value: "image", label: "Image" },
  { value: "youtube", label: "YouTube" },
  { value: "code", label: "Code" },
  { value: "ol", label: "Order List" },
  { value: "ul", label: "Unorder List" },
];

// Language Options
const languageOptions = [
  { value: "apache", label: "Apache" },
  { value: "bash", label: "Bash" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "css", label: "CSS" },
  { value: "diff", label: "Diff" },
  { value: "dockerfile", label: "Dockerfile" },
  { value: "go", label: "Go" },
  { value: "ini", label: "INI" },
  { value: "java", label: "Java" },
  { value: "javascript", label: "JavaScript" },
  { value: "json", label: "JSON" },
  { value: "kotlin", label: "Kotlin" },
  { value: "less", label: "Less" },
  { value: "lua", label: "Lua" },
  { value: "makefile", label: "Makefile" },
  { value: "markdown", label: "Markdown" },
  { value: "nginx", label: "Nginx" },
  { value: "objectivec", label: "Objective-C" },
  { value: "php", label: "PHP" },
  { value: "python", label: "Python" },
  { value: "ruby", label: "Ruby" },
  { value: "rust", label: "Rust" },
  { value: "scss", label: "SCSS" },
  { value: "shell", label: "Shell" },
  { value: "sql", label: "SQL" },
  { value: "swift", label: "Swift" },
  { value: "typescript", label: "TypeScript" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
];


function PageComponent() {
  const { subTitleId } = useParams();
  const [subTitle, setSubTitle] = useState(null);
  const [pageComponents, setPageComponents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [formData, setFormData] = useState({
    page_description: "",
    page_component_type: null,
    page_component_order: 0,
    row_status: "separate",
    special_class: "",
    page_component_image: null,
    language: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Event listener for paste event
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.includes("image")) {
            const file = item.getAsFile();
            setFormData((prevFormData) => ({
              ...prevFormData,
              page_component_image: file,
              page_description: "",
            }));
            setImagePreview(URL.createObjectURL(file));
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handleLanguageChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      language: selectedOption,
    }));
  };


  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/sub-subject/${subTitleId}/page-components`
      );

      if (response.data) {
        const { subSubject, pageComponents } = response.data;
        setSubTitle(subSubject);
        setPageComponents(pageComponents);
      }
    } catch (error) {
      setError("Error fetching subjects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Clear image if the description is updated
    if (name === "page_description" && value !== "") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        page_component_image: null,
      }));
      setImagePreview(null);
    }
  };

  const handleComponentTypeChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      page_component_type: selectedOption,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        page_component_image: file,
        page_description: "",
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openModal = (type, component = null) => {
    if (type === "edit") {
      setSelectedComponent(component);
      setModalType("edit");
      setFormData({
        page_description: component.page_description || "",
        page_component_type: component.page_component_type
          ? componentTypeOptions.find(
              (option) => option.value === component.page_component_type
            )
          : null,
        page_component_order: component.page_component_order || 0,
        row_status: component.row_status || "separate",
        special_class: component.special_class || "",
        language: component.language
          ? languageOptions.find(
              (option) => option.value === component.language
            )
          : null, 
        page_component_image: null,
      });

      setImagePreview(
        component.page_component_image
          ? getUrl(component.page_component_image)
          : "https://placehold.co/50x50"
      );
      setShowModal(true);
    } else if (type === "add") {
      // Clear all form fields
      setFormData({
        page_description: "",
        page_component_type: null,
        page_component_order: 0,
        row_status: "separate",
        special_class: "",
        page_component_image: null,
      });
      setImagePreview(null);
      setModalType("add");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setError("");
    setImagePreview(null);
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("page_description", formData.page_description);
      formDataToSend.append(
        "page_component_type",
        formData.page_component_type?.value || ""
      );
      formDataToSend.append(
        "page_component_order",
        formData.page_component_order
      );
      formDataToSend.append("row_status", formData.row_status);
      formDataToSend.append("special_class", formData.special_class);
      formDataToSend.append("sub_subject_id", subTitleId);

      // Include the language field in the request
      formDataToSend.append("language", formData.language?.value || "");

      if (formData.page_component_image) {
        formDataToSend.append(
          "page_component_image",
          formData.page_component_image
        );
      }

      if (modalType === "add") {
        await axiosInstance.post("/page-component", formDataToSend);
        Swal.fire("Success", "Page component added successfully!", "success");
      } else if (modalType === "edit") {
        const result = await Swal.fire({
          title: "Confirm Update",
          text: "Are you sure you want to update this page component?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, update it!",
        });

        if (result.isConfirmed) {
          await axiosInstance.put(
            `/page-component/${selectedComponent.page_component_id}`,
            formDataToSend
          );
          Swal.fire(
            "Updated",
            "Page component updated successfully!",
            "success"
          );
        }
      }

      fetchSubjects();
      closeModal();
    } catch (error) {
      setError("Error saving page component. Please try again.");
    }
  };


  const handleDelete = async (component) => {
    const result = await Swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this page component?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(
          `/page-component/${component.page_component_id}`
        );
        Swal.fire("Deleted", "Page component deleted successfully!", "success");
        fetchSubjects();
      } catch (error) {
        setError("Error deleting page component. Please try again.");
      }
    }
  };

  return (
    <Container>
      <h1 className="mb-3">{subTitle?.sub_subject_title}</h1>
      <p className="text-muted">{subTitle?.sub_subject_short_title}</p>
      <hr />

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Button
            variant="primary"
            className="mb-3"
            onClick={() => openModal("add")}
          >
            <FaPlus className="me-2" /> Add Page Component
          </Button>

          {error && (
            <Alert variant="danger" className="mt-3" transition>
              {error}
            </Alert>
          )}

          <div className="d-flex flex-wrap">
            {pageComponents.map((component) => (
              <Card
                key={component.page_component_id}
                className="m-2"
                style={{ width: "18rem" }}
              >
                <Card.Body>
                  <Card.Title>{component.page_component_type}</Card.Title>

                  {component.page_description && (
                    <Card.Text>
                      <strong>Description:</strong> {component.page_description}
                    </Card.Text>
                  )}

                  {component.page_component_order && (
                    <Card.Text>
                      <strong>Order:</strong> {component.page_component_order}
                    </Card.Text>
                  )}

                  {component.row_status && (
                    <Card.Text>
                      <strong>Row Status:</strong> {component.row_status}
                    </Card.Text>
                  )}

                  {component.special_class && (
                    <Card.Text>
                      <strong>Special Class:</strong> {component.special_class}
                    </Card.Text>
                  )}

                  {component.language && (
                    <Card.Text>
                      <strong>Language:</strong> {component.language}
                    </Card.Text>
                  )}

                  {component.page_component_image && (
                    <Image
                      src={getUrl(component.page_component_image)}
                      alt="Component Image"
                      thumbnail
                      style={{ width: "100%", height: "auto" }}
                    />
                  )}

                  <div className="mt-3 d-flex justify-content-between">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit</Tooltip>}
                    >
                      <Button
                        variant="warning"
                        onClick={() => openModal("edit", component)}
                      >
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete</Tooltip>}
                    >
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(component)}
                      >
                        <FaTrash />
                      </Button>
                    </OverlayTrigger>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Modal for Add and Edit */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add" && "Add Page Component"}
            {modalType === "edit" && "Edit Page Component"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="page_description" className="mb-3">
              <Form.Label>Page Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="page_description"
                value={formData.page_description}
                onChange={handleInputChange}
                disabled={!!formData.page_component_image}
              />
            </Form.Group>
            <Form.Group controlId="page_component_type" className="mb-3">
              <Form.Label>Component Type</Form.Label>
              <Select
                options={componentTypeOptions}
                value={formData.page_component_type}
                onChange={handleComponentTypeChange}
                isClearable
              />
            </Form.Group>
            <Form.Group controlId="page_component_order" className="mb-3">
              <Form.Label>Component Order</Form.Label>
              <Form.Control
                type="number"
                name="page_component_order"
                value={formData.page_component_order}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="row_status" className="mb-3">
              <Form.Label>Row Status</Form.Label>
              <Form.Control
                as="select"
                name="row_status"
                value={formData.row_status}
                onChange={handleInputChange}
              >
                <option value="row">Row</option>
                <option value="separate">Separate</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="special_class" className="mb-3">
              <Form.Label>Special Class</Form.Label>
              <Form.Control
                type="text"
                name="special_class"
                value={formData.special_class}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="language" className="mb-3">
              <Form.Label>Language</Form.Label>
              <Select
                options={languageOptions}
                value={formData.language}
                onChange={handleLanguageChange}
                isClearable
              />
            </Form.Group>
            <Form.Group controlId="page_component_image" className="mb-3">
              <Form.Label>Component Image (Paste or Upload)</Form.Label>
              <Form.Control
                type="file"
                name="page_component_image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={!!formData.page_description}
              />
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  thumbnail
                  className="mt-3"
                  style={{ width: "100px", height: "auto" }}
                />
              )}
              <Form.Text className="text-muted">
                You can also paste an image using <strong>Ctrl + V</strong>.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PageComponent;
