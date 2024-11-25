import logoImg from "/src/assets/logo.png";

export default function Header() {
  return (
    <div
      style={{
        width: "390px",
        display: "flex",
        flexDirection: "row",
        height: "60px",
        position: "fixed",
        backgroundColor: "white",
        top: 0,
        zIndex: 1,
      }}
    >
      <img
        src={logoImg}
        alt="logo"
        style={{
          width: "30%",
          objectFit: "contain",
          height: "60px",
          objeftFit: "contain",
          padding: "5px",
          backgroundColor: "white",
        }}
      />
      <div style={{ width: "70%", textAlign: "left" }}>스꾸라이프</div>
    </div>
  );
}
