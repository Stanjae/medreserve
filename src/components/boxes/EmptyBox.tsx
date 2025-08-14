"use client";
import { Icon, IconInbox, IconProps } from "@tabler/icons-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
  iconColor?: string;
  iconSize?: number;
  Button: React.ReactNode;
  minHeight?: number;
  showPaper?: boolean;
};

const EmptyState = ({
  title = "No data found",
  description = "There's nothing here yet",
  icon,
  iconColor = "#6b7280",
  iconSize = 48,
  Button,
  minHeight = 200,
  showPaper = true,
}:EmptyStateProps) => {

  // Default icon based on context
  const DefaultIcon = icon || IconInbox;

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: `${minHeight}px`,
    padding: showPaper ? "2rem" : "1rem",
    ...(showPaper && {
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    }),
  };
  const iconContainerStyle = {
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    borderRadius: "50%",
    backgroundColor: `${iconColor}20`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "0.5rem",
  };

  const titleStyle = {
    fontSize: "1.125rem",
    fontWeight: "500",
    color: "#6b7280",
    margin: "0 0 0.25rem 0",
  };

  const descriptionStyle = {
    fontSize: "0.875rem",
    color: "#9ca3af",
    margin: "0 0 1rem 0",
    lineHeight: "1.5",
  };

  return (
    <div style={containerStyle}>
      <div className=" flex flex-col items-center max-w-[400px] text-center gap-4 ">
        <div style={iconContainerStyle}>
          <DefaultIcon size={iconSize * 0.6} color={iconColor} />
        </div>

        <div>
          <h3 style={titleStyle}>{title}</h3>
          <p style={descriptionStyle}>{description}</p>
        </div>

        {Button && (
          <div style={{ marginTop: "0.5rem" }}>{Button}</div>
        )}
      </div>
    </div>
  );
};

// Button component for actions



export default EmptyState;