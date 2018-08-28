<%@ page contentType="application/json;charset=UTF-8" language="java" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.sql.*" %>
<%@ page import="javax.sql.*" %>
<%@ page import="javax.naming.*" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page import="java.security.MessageDigest" %>
<%@ page import="org.json.*" %>

<%!
	private String bytesToHex(byte[] bytes) {
		StringBuffer result = new StringBuffer();
		for (byte byt : bytes) result.append(Integer.toString((byt & 0xff) + 0x100, 16).substring(1));
		return result.toString();
	}
%>

<%
	try {
		JSONObject requestObj = new JSONObject();
		Map<String, String[]> parameters = request.getParameterMap();
		for (String parameter : parameters.keySet()) {
			requestObj.put(parameter, request.getParameter(parameter));
		}
		
		InitialContext initialContext = new InitialContext();
		Context environmentContext = (Context)initialContext.lookup("java:/comp/env");
		DataSource dataSource = (DataSource)environmentContext.lookup("jdbc/aviation");
		Connection conn = dataSource.getConnection();
		
		PreparedStatement statement = conn.prepareStatement("SELECT * FROM billing_addresses WHERE email = ?");
		statement.setString(1, requestObj.getString("email"));
		
		ResultSet existingBilling = statement.executeQuery();

		JSONObject returnObj = new JSONObject();
		if (existingBilling.next()) {
			statement = conn.prepareStatement("UPDATE `billing_addresses` SET `prefix` = ?, `firstName` = ?, `lastName` = ?, `street` = ?, `postalCode` = ?, `postalCity` = ?, `country` = ?, `email` = ?, `phoneNumber` = ?;");
			statement.setString(1, requestObj.getString("title"));
			statement.setString(2, requestObj.getString("firstName"));
			statement.setString(3, requestObj.getString("lastName"));
			statement.setString(4, requestObj.getString("street"));
			statement.setString(5, requestObj.getString("zip"));
			statement.setString(6, requestObj.getString("city"));
			statement.setString(7, requestObj.getString("country"));
			statement.setString(8, requestObj.getString("email"));
			statement.setString(9, requestObj.getString("phone"));
			
			if (statement.executeUpdate() > 0) {
				returnObj.put("code", 200);
				returnObj.put("billingId", existingBilling.getString("id"));
			}
		} else {
			String billingId = bytesToHex(MessageDigest.getInstance("SHA-256").digest(String.format("%s%s%s%d", requestObj.getString("firstName"), requestObj.getString("lastName"), requestObj.getString("email"), System.currentTimeMillis() / 1000L).getBytes(StandardCharsets.UTF_8))).substring(0, 32);

			statement = conn.prepareStatement("INSERT INTO billing_addresses VALUES(?, '', ?, ?, ?, ?, ?, ?, ?, ?, ?, DEFAULT, DEFAULT)");
			statement.setString(1, billingId);
			statement.setString(2, requestObj.getString("title"));
			statement.setString(3, requestObj.getString("firstName"));
			statement.setString(4, requestObj.getString("lastName"));
			statement.setString(5, requestObj.getString("street"));
			statement.setString(6, requestObj.getString("zip"));
			statement.setString(7, requestObj.getString("city"));
			statement.setString(8, requestObj.getString("country"));
			statement.setString(9, requestObj.getString("email"));
			statement.setString(10, requestObj.getString("phone"));
			
			if (statement.executeUpdate() > 0) {
				returnObj.put("code", 200);
				returnObj.put("billingId", billingId);
			}
		}

		conn.close();

		out.println(returnObj);
	} catch (Exception e) {
		e.printStackTrace();
		
		JSONObject returnObj = new JSONObject();
		
		returnObj.put("code", 500);
		returnObj.put("message", e.getMessage());
		out.println(returnObj);
	}
%>