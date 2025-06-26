

interface EmailTemplateProps {
  firstName: string;
  argon: string;
  userId: string;
}

export const EmailTemplate:  React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  argon,
  userId
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
    <h1>Password Reset Request</h1>
    <p>Hi {firstName},</p>
    <p>
      We received a request to reset your password. Click the button below to set a new password:
    </p>
    <p>
      <a
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password/${userId}?token=${argon}`}
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        Reset Password
      </a>
    </p>
    <p>
      If you did not request a password reset, please ignore this email or contact support.
    </p>
    <p>Thanks,<br />Your Company Team &copy; MedReverse</p>
  </div>
);
