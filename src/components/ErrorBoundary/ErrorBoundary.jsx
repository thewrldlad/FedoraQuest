import { Component } from "react";
import Button from "../Button/Button";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("FedoraQuest crashed:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-fedora-bg">
          <div className="bg-fedora-surface border border-fedora-border rounded-xl p-8 max-w-md text-center">
            <h1 className="text-2xl font-display text-fedora-text mb-3">
              🐧 Something went wrong
            </h1>

            <p className="text-fedora-muted mb-6">
              FedoraQuest hit an unexpected error. Your progress is saved —
              try reloading the page to continue.
            </p>

            <Button onClick={this.handleReload}>Reload FedoraQuest</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
