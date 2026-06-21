export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a2e4a",
        color: "#ffffff",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <img
        src="/logo/US.png"
        alt="US Holding"
        style={{ width: 80, height: 80, marginBottom: "1.5rem" }}
      />
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        US Holding
      </h1>
      <p style={{ fontSize: "1.125rem", color: "#94a3b8", maxWidth: 480 }}>
        Новая версия сайта в разработке. Скоро здесь будет полноценный сайт
        группы компаний.
      </p>
    </main>
  );
}
