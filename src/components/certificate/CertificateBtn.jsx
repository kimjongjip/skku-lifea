import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function CertificateBtn() {
  const [upload, setUpload] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const inputRef = useRef();

  const onUploadImage = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    setImageFile(file);
    setUpload(true);
  };

  const handleUpload = () => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  };

  const handleDelete = () => {
    setImageFile(null);
    setUpload(false);
  };

  useEffect(() => {
    if (imageFile !== null) {
      handleSubmit();
    }
  }, [imageFile]);

  const handleSubmit = async () => {
    if (!imageFile) {
      alert("이미지를 업로드해주세요!");
      return;
    }
    const formData = new FormData();
    formData.append("verification", imageFile);
    try {
      const response = await axios.post(
        "https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev/verification/upload",
        { classId: classId, verification: formData },
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaGxla2RsZjEyMzRAZ21haWwuY29tIiwiaWF0IjoxNzMyNjA1OTU5LCJleHAiOjE3NjQxNDE5NTl9.86LBbz7DGZGGlLrJVwNwZmroV6XB_m-BqkPtcbm_z8k",
            accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("업로드 성공:", response.data);
      alert("이미지가 성공적으로 업로드되었습니다!");
    } catch (error) {
      // console.error("업로드 실패:", error.response?.data || error.message);
      alert("이미지 업로드 중 문제가 발생했습니다.");
    }
  };

  return (
    <div style={{ width: "90%" }}>
      {upload === false ? (
        <div>
          <input
            type="file"
            style={{ display: "none" }}
            accept="image/*"
            ref={inputRef}
            onChange={onUploadImage}
          />
          <button
            style={{
              backgroundColor: "#F2F2F2",
              width: "100%",
              height: "15vh",
              borderRadius: "20px",
            }}
            onClick={handleUpload}
          >
            + 인증하기
          </button>
        </div>
      ) : (
        <div>
          <button
            style={{
              backgroundColor: "#919191",
              width: "100%",
              height: "15vh",
              borderRadius: "20px",
            }}
            onClick={handleDelete}
          >
            다시 업로드 하기
          </button>
        </div>
      )}
    </div>
  );
}
