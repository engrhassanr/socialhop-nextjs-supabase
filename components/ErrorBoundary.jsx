"use client";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#ff4d4f",
            background: "#fff2f0",
            border: "1px solid #ffccc7",
            borderRadius: "6px",
            margin: "20px",
          }}
        >
          <h3>Something went wrong</h3>
          <p>An error occurred while rendering this component.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "8px 16px",
              background: "#1890ff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
