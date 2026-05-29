import React, { useState, useEffect } from "react";

interface CleanFormattedNumberInputProps {
  value: number;
  onChange: (val: number) => void;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  allowDecimals?: boolean;
}

export const CleanFormattedNumberInput: React.FC<CleanFormattedNumberInputProps> = ({
  value,
  onChange,
  className = "inp",
  placeholder = "",
  min,
  max,
  allowDecimals = false,
}) => {
  const [typedValue, setTypedValue] = useState<string>("");

  // Helper to format to Vietnamese locale string (dot as thousand, comma as decimal)
  const formatToVietnameseStr = (num: number): string => {
    if (num === null || num === undefined || isNaN(num)) return "";
    if (num === 0) return "0";
    
    // For decimals, we don't need excessive trailing zeros unless they are typed
    return num.toLocaleString("vi-VN", {
      maximumFractionDigits: allowDecimals ? 4 : 0,
    });
  };

  // Helper to parse string to number (supporting dots as thousands and commas as decimal)
  const parseVietnameseNumber = (str: string): number => {
    if (!str) return 0;
    // Strip dots (thousands separators in vi-VN)
    let cleaned = str.replace(/\./g, "");
    // Replace commas (decimal in vi-VN) with standard dot for parsing
    cleaned = cleaned.replace(/,/g, ".");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Keep internal input text in sync with external value
  useEffect(() => {
    const currentParsed = parseVietnameseNumber(typedValue);
    if (currentParsed !== value || typedValue === "") {
      setTypedValue(formatToVietnameseStr(value));
    }
  }, [value, allowDecimals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;

    if (inputVal === "") {
      setTypedValue("");
      onChange(0);
      return;
    }

    // Decimals mode:
    if (allowDecimals) {
      // Allow digits, commas, dots and negative signs
      let cleaned = inputVal.replace(/[^0-9.,-]/g, "");
      
      // If user types standard dot on keyboard, they mean decimal. 
      // If there's already a comma, ignore dot. Otherwise, let's treat the dot as comma (decimal separator).
      // Let's see if there is a comma.
      if (cleaned.endsWith(".")) {
        // Replace trailing dot with comma for Vietnamese formatting
        cleaned = cleaned.slice(0, -1) + ",";
      }

      setTypedValue(cleaned);

      const parsed = parseVietnameseNumber(cleaned);
      let finalVal = parsed;
      if (max !== undefined && finalVal > max) finalVal = max;
      if (min !== undefined && finalVal < min) finalVal = min;
      onChange(finalVal);
    } else {
      // Integers mode - thousands separator
      // Strip everything except digits and minus
      const cleanedDigits = inputVal.replace(/[^0-9-]/g, "");
      if (cleanedDigits === "" || cleanedDigits === "-") {
        setTypedValue(cleanedDigits);
        onChange(0);
        return;
      }

      const numValue = parseInt(cleanedDigits, 10);
      let finalVal = numValue;
      if (max !== undefined && finalVal > max) finalVal = max;
      if (min !== undefined && finalVal < min) finalVal = min;

      // Realtime formatted display
      setTypedValue(finalVal.toLocaleString("vi-VN"));
      onChange(finalVal);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // "Khi nhập dữ liệu là nhập luôn số đã nhập, không bị hiện số 0 hoặc phải chọn để xóa bỏ gây khó chịu cho người nhập liệu."
    if (value === 0 || typedValue === "0" || typedValue === "0,0" || typedValue === "0.0") {
      setTypedValue("");
    } else {
      e.target.select();
    }
  };

  const handleBlur = () => {
    if (typedValue === "" || typedValue === "-") {
      setTypedValue("0");
      onChange(0);
    } else {
      let parsed = parseVietnameseNumber(typedValue);
      if (max !== undefined && parsed > max) parsed = max;
      if (min !== undefined && parsed < min) parsed = min;
      setTypedValue(formatToVietnameseStr(parsed));
      onChange(parsed);
    }
  };

  return (
    <input
      type="text"
      className={className}
      value={typedValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
    />
  );
};
