import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-4">
      <p>© {new Date().getFullYear()} Capstone Project. All rights reserved.</p>
    </footer>
  );
}

export default Footer;