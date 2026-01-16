export default function Footer() {
  return (
    <footer className="text-dark mt-5 py-4 border-top border-dark">
      <div className="container text-center">

        <h5 className="fw-bold">BlogsSite</h5>
        <p className="small mb-3">
          A simple blogging platform built with React and Bootstrap.
        </p>

        <div className="d-flex justify-content-center gap-3 mb-3">
          <a href="#" className="text-dark text-decoration-none small">About</a>
          <a href="#" className="text-dark text-decoration-none small">Contact</a>
          <a href="#" className="text-dark text-decoration-none small">Privacy</a>
        </div>

        <p className="small mb-0">
          © {new Date().getFullYear()} BlogsSite. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
