import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Column,
  Row
} from "@react-email/components";
import * as React from "react";
import { render } from "@react-email/render";
import { FaSeedling } from "react-icons/fa";

interface PriceChangeEmailProps {
  produce: string;
  newPrice: string;
}

export const PriceChangeEmail = ({
  produce,
  newPrice
}: PriceChangeEmailProps) => (
  <Html>
    <Head />
    <Preview>
      New Price Alert: {produce} now at {newPrice}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <div style={headerContent}>
            <FaSeedling size={36} color="#388E3C" />
            <Text style={headerTitle}>Farm Produce Price Update</Text>
          </div>
        </Section>

        <Section style={alertSection}>
          <Text style={alertTitle}>
            📢 {produce.toUpperCase()} PRICE UPDATE 📢
          </Text>

          <Row style={row}>
            <Column style={leftColumn}>Produce:</Column>
            <Column style={rightColumn}>
              <strong>{produce}</strong>
            </Column>
          </Row>

          <Row style={row}>
            <Column style={leftColumn}>New Price:</Column>
            <Column style={rightColumn}>
              <strong>{newPrice}</strong>
            </Column>
          </Row>

          <Section style={detailsSection}>
            <Text style={sectionTitle}>Why this matters:</Text>
            <Text style={detailsText}>
              Staying updated on price changes helps you make better market
              decisions and maximize your profits.
            </Text>
          </Section>

          <Section style={actionSection}>
            <Text style={actionText}>
              Check your farm dashboard for more updates!
            </Text>
            <a href="https://localhost:3000/dash/farm" style={actionButton}>
              GO TO DASHBOARD
            </a>
          </Section>
        </Section>

        <Text style={footer}>
          AgriMarket Alerts • {new Date().getFullYear()}
          <br />
          This is an automated notification — no reply is necessary.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PriceChangeEmail;

export const renderPriceChangeEmail = async (props: PriceChangeEmailProps) =>
  await render(<PriceChangeEmail {...props} />);

// Reuse the same styles as in the original template
const main = {
  backgroundColor: "#f5f5f5",
  color: "#333333",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px 0 30px"
};

const header = {
  backgroundColor: "#388E3C",
  padding: "20px",
  textAlign: "center" as const,
  marginBottom: "20px"
};

const headerContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px"
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0"
};

const alertSection = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
};

const alertTitle = {
  color: "#388E3C",
  fontSize: "22px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 20px 0",
  paddingBottom: "15px",
  borderBottom: "1px solid #eeeeee"
};

const row = {
  margin: "15px 0",
  display: "flex",
  width: "100%"
};

const leftColumn = {
  width: "30%",
  fontWeight: "bold",
  paddingRight: "10px"
};

const rightColumn = {
  width: "70%"
};

const detailsSection = {
  backgroundColor: "#E8F5E9",
  padding: "15px",
  borderRadius: "5px",
  margin: "20px 0",
  borderLeft: "4px solid #66BB6A"
};

const sectionTitle = {
  fontWeight: "bold",
  marginBottom: "10px",
  fontSize: "16px"
};

const detailsText = {
  margin: "0",
  lineHeight: "1.5"
};

const actionSection = {
  textAlign: "center" as const,
  margin: "25px 0 10px 0"
};

const actionText = {
  fontWeight: "bold",
  color: "#388E3C",
  marginBottom: "15px"
};

const actionButton = {
  backgroundColor: "#388E3C",
  color: "#ffffff",
  padding: "12px 25px",
  borderRadius: "4px",
  textDecoration: "none",
  fontWeight: "bold",
  display: "inline-block"
};

const footer = {
  color: "#777777",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "30px",
  lineHeight: "1.5"
};
