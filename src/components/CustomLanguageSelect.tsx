import React, { useState } from "react";

interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

interface CustomLanguageSelectProps {
  options: LanguageOption[];
  onChange: (code: string) => void;
  defaultValue: string;
}

const CustomLanguageSelect: React.FC<CustomLanguageSelectProps> = ({
  options,
  onChange,
  defaultValue,
}) => {
  const [selected, setSelected] = useState<string>(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (code: string) => {
    setSelected(code);
    onChange(code);
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="custom-select" style={{ position: "relative" }}>
      <div
        className="selected-option"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          border: "1px solid #ccc",
          padding: "5px 10px",
          borderRadius: "4px",
        }}
      >
        <img
          src={
            options.find((opt: LanguageOption) => opt.code === selected)?.flag
          }
          alt={selected}
          style={{ width: "20px", marginRight: "5px" }}
        />
        <span>{selected.toUpperCase()}</span>
      </div>
      {isOpen && (
        <div
          className="options"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            zIndex: 1000,
            width: "100%",
          }}
        >
          {options.map(({ code, flag }: LanguageOption) => (
            <div
              key={code}
              className="option"
              onClick={() => handleSelect(code)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              <img
                src={flag}
                alt={code}
                style={{ width: "20px", marginRight: "5px" }}
              />
              <span>{code.toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomLanguageSelect;
