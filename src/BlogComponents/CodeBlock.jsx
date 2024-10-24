import React, { useState } from "react";
import styled from "styled-components";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // New theme
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";
import { FaCopy, FaCheck } from "react-icons/fa"; // Icons for copy button

// Import languages
import apache from "react-syntax-highlighter/dist/esm/languages/hljs/apache";
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import c from "react-syntax-highlighter/dist/esm/languages/hljs/c";
import cpp from "react-syntax-highlighter/dist/esm/languages/hljs/cpp";
import csharp from "react-syntax-highlighter/dist/esm/languages/hljs/csharp";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import diff from "react-syntax-highlighter/dist/esm/languages/hljs/diff";
import dockerfile from "react-syntax-highlighter/dist/esm/languages/hljs/dockerfile";
import go from "react-syntax-highlighter/dist/esm/languages/hljs/go";
import ini from "react-syntax-highlighter/dist/esm/languages/hljs/ini";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import kotlin from "react-syntax-highlighter/dist/esm/languages/hljs/kotlin";
import less from "react-syntax-highlighter/dist/esm/languages/hljs/less";
import lua from "react-syntax-highlighter/dist/esm/languages/hljs/lua";
import makefile from "react-syntax-highlighter/dist/esm/languages/hljs/makefile";
import markdown from "react-syntax-highlighter/dist/esm/languages/hljs/markdown";
import nginx from "react-syntax-highlighter/dist/esm/languages/hljs/nginx";
import objectivec from "react-syntax-highlighter/dist/esm/languages/hljs/objectivec";
import php from "react-syntax-highlighter/dist/esm/languages/hljs/php";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import ruby from "react-syntax-highlighter/dist/esm/languages/hljs/ruby";
import rust from "react-syntax-highlighter/dist/esm/languages/hljs/rust";
import scss from "react-syntax-highlighter/dist/esm/languages/hljs/scss";
import shell from "react-syntax-highlighter/dist/esm/languages/hljs/shell";
import sql from "react-syntax-highlighter/dist/esm/languages/hljs/sql";
import swift from "react-syntax-highlighter/dist/esm/languages/hljs/swift";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml";

// Register languages
SyntaxHighlighter.registerLanguage("apache", apache);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("c", c);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("diff", diff);
SyntaxHighlighter.registerLanguage("dockerfile", dockerfile);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("ini", ini);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("kotlin", kotlin);
SyntaxHighlighter.registerLanguage("less", less);
SyntaxHighlighter.registerLanguage("lua", lua);
SyntaxHighlighter.registerLanguage("makefile", makefile);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("nginx", nginx);
SyntaxHighlighter.registerLanguage("objectivec", objectivec);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("shell", shell);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("xml", xml);
SyntaxHighlighter.registerLanguage("yaml", yaml);

// Styled container for the code block
const CodeBlockWrapper = styled.div`
  position: relative;
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8; /* Light background */
  font-family: "Fira Code", monospace;
  border: 1px solid #ddd; /* Light gray border */
`;

// Styled label for language display
const LanguageLabel = styled.div`
  position: absolute;
  top: 5px;
  left: 10px;
  background: #e0e0e0;
  color: #333;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 4px;
  z-index: 2;
  border: 1px solid #ccc;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

// Styled button for copying code
const CopyButton = styled.button`
  position: absolute;
  top: 5px;
  right: 10px;
  background: transparent;
  color: #333;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  z-index: 2;

  &:hover {
    color: #007bff;
  }
`;

// Styled success message for copy button
const CopySuccess = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #36d7b7;
`;

const CodeBlock = ({ code, language, special_class }) => {
  const [copied, setCopied] = useState(false);

  // Handle copying code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <CodeBlockWrapper className={special_class}>
      {/* Language label */}
      <LanguageLabel>{language.toUpperCase()}</LanguageLabel>

      {/* Copy button */}
      <CopyButton onClick={handleCopy}>
        {copied ? (
          <CopySuccess>
            <FaCheck /> Copied
          </CopySuccess>
        ) : (
          <>
            <FaCopy /> Copy
          </>
        )}
      </CopyButton>

      {/* Syntax highlighter for code block */}
      <SyntaxHighlighter
        language={language}
        style={docco} // Use the docco theme or change to oneDark if needed
        customStyle={{
          margin: 0,
          padding: "20px",
          fontSize: "14px",
          lineHeight: "1.5",
          fontFamily: "'Fira Code', monospace",
        }}
        className="pt-5"
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </CodeBlockWrapper>
  );
};

export default CodeBlock;
