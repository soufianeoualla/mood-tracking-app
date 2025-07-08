import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export const WelcomeTemplate = ({
  confirmationLink,
}: {
  confirmationLink: string;
}) => (
  <Html>
    <Head />
    <Preview>Start tracking your mood, sleep, and feelings</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="170"
          height="50"
          alt="Mood Tracker"
          style={logo}
        />
        <Text style={paragraph}>Hi,</Text>
        <Text style={paragraph}>
          Welcome to Mood Tracker — your personal companion for emotional
          wellness. Start tracking your mood, sleep, and daily feelings to
          better understand your mental well-being.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={confirmationLink}>
            Get started
          </Button>
        </Section>
        <Text style={paragraph}>
          Wishing you clarity and calm,
          <br />
          The Mood Tracker Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>support@soufian.me</Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeTemplate;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#4865db",
  borderRadius: "8px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "180px",
  padding: "14px 7px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
