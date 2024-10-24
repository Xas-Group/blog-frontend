import { H1, H2, H3, H4, H5, P } from "../Components/Typography";
import { getUrl } from "../services/UrlServices";
import CodeBlock from "./CodeBlock";
import ImageComponent from "./ImageComponent";
import OrderedList from "./OrderedList";
import UnorderedList from "./UnorderedList";
import YouTubeIframe from "./YouTubeIframe";

function BlogComponent({ pageComponent }) {
  const {
    page_description,
    page_component_image,
    page_component_type,
    special_class,
    language,
  } = pageComponent;

  const components = [
    { type: "h1", element: H1 },
    { type: "h2", element: H2 },
    { type: "h3", element: H3 },
    { type: "h4", element: H4 },
    { type: "h5", element: H5 },
    { type: "p", element: P },
  ];

  // Find the matching component based on page_component_type
  const getComponent = () => {
    const foundComponent = components.find(
      (comp) => comp.type === page_component_type
    );

    if (foundComponent) {
      const Element = foundComponent.element;
      return <Element className={special_class}>{page_description}</Element>;
    } else if (page_component_type == "youtube") {
      return <YouTubeIframe src={page_description} />;
    } else if (page_component_type == "code") {
      return (
        <CodeBlock
          code={page_description}
          language={language}
          special_class={special_class}
        />
      );
    } else if (page_component_type == "ol") {
      return (
        <OrderedList text={page_description} special_class={special_class} />
      );
    } else if (page_component_type == "ul") {
      return (
        <UnorderedList text={page_description} special_class={special_class} />
      );
    } else if (page_component_type == "image") {
      return (
        <ImageComponent
          src={getUrl(page_component_image)}
          alt={"Blog Image"}
          special_class={special_class}
        />
      );
    }
    // Return a default element if no match is found
    return <P className={special_class}>{page_description}</P>;
  };

  return (
    <div>
      {getComponent()}
    </div>
  );
}

export default BlogComponent;
