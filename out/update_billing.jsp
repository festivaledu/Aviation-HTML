<%@ page contentType="application/json;charset=UTF-8" language="java" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.sql.*" %>
<%@ page import="javax.sql.*" %>
<%@ page import="javax.naming.*" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page import="java.security.MessageDigest" %>
<%@ page import="org.json.*" %>

<%!
	/**
	 * A method to convert byte data returned from
	 * MessageDigest.digest() into a usable string
	 *
	 * @param bytes Byte data from MessageDigest.digest(), or any other byte data
	 * @return A usable string
	 */
	private String bytesToHex(byte[] bytes) {
		StringBuffer result = new StringBuffer();
		for (byte byt : bytes) result.append(Integer.toString((byt & 0xff) + 0x100, 16).substring(1));
		return result.toString();
	}
%>

<%
	// This is a file that returns JSON data, so if we put this header at the very top, the application fails
	/**
	 * update_billing.jsp
	 * FESTIVAL Aviation
	 * 
	 * Update a user's billing address
	 * or create new entries
	 * 
	 * @author Janik Schmidt (jani.schmidt@ostfalia.de), Fabian Krahtz (f.krahtz@ostfalia.de)
	 * @version 1.0
	 */
	
	// Since we're working with SQL, wrap everything inside try/catch
	try {
		// The billing address details might contain special characters (like Ísafjörður)
		// so we need to set the character encoding to UTF-8
		request.setCharacterEncoding("UTF-8");
		
		// Map the request parameters into a JSON object (key/value)
		JSONObject requestObj = new JSONObject();
		Map<String, String[]> parameters = request.getParameterMap();
		for (String parameter : parameters.keySet()) {
			requestObj.put(parameter, request.getParameter(parameter));
		}
		
		// Create a new database connection
		InitialContext initialContext = new InitialContext();
		Context environmentContext = (Context)initialContext.lookup("java:/comp/env");
		DataSource dataSource = (DataSource)environmentContext.lookup("jdbc/aviation");
		Connection conn = dataSource.getConnection();
		
		// Check if we already have a billing address with the specified account ID that's not empty
		PreparedStatement statement = conn.prepareStatement("SELECT * FROM billing_addresses WHERE accountId = ? AND accountId NOT LIKE ''");
		
		// If we have a session ID, try to get the corresponding account ID
		if (String.valueOf(session.getAttribute("sid")) != null) {
			PreparedStatement accountStatement = conn.prepareStatement("SELECT accountId FROM sessions WHERE id = ?");
			accountStatement.setString(1, String.valueOf(session.getAttribute("sid")));
			ResultSet sessionAccount = accountStatement.executeQuery();
			
			if (sessionAccount.next()) {
				// If we have an account ID, add it to the query
				statement.setString(1, sessionAccount.getString("accountId"));
			} else {
				// Otherwise add an empty string
				statement.setString(1, "");
			}
		} else {
			// Otherwise add an empty string
			statement.setString(2, "");
		}
		
		ResultSet existingBilling = statement.executeQuery();

		// Now it's time to do billing address stuff
		JSONObject returnObj = new JSONObject();
		if (existingBilling.next()) {
			// If there is already a billing address associated to an account, we can go ahead and just update it
			statement = conn.prepareStatement("UPDATE `billing_addresses` SET `prefix` = ?, `firstName` = ?, `lastName` = ?, `street` = ?, `postalCode` = ?, `postalCity` = ?, `country` = ?, `email` = ?, `phoneNumber` = ?;");
			
			// Just fill in the data
			statement.setString(1, requestObj.getString("title"));
			statement.setString(2, requestObj.getString("firstName"));
			statement.setString(3, requestObj.getString("lastName"));
			statement.setString(4, requestObj.getString("street"));
			statement.setString(5, requestObj.getString("zip"));
			statement.setString(6, requestObj.getString("city"));
			statement.setString(7, requestObj.getString("country"));
			statement.setString(8, requestObj.getString("email"));
			statement.setString(9, requestObj.getString("phone"));
			
			// If the update was successful, we return code 200 and the existing billing ID
			if (statement.executeUpdate() > 0) {
				returnObj.put("code", 200);
				returnObj.put("billingId", existingBilling.getString("id"));
			}
		} else {
			// Generate a new billing ID with first name, last name, email address and current UNIX timestamp
			String billingId = bytesToHex(MessageDigest.getInstance("SHA-256").digest(String.format("%s%s%s%d", requestObj.getString("firstName"), requestObj.getString("lastName"), requestObj.getString("email"), System.currentTimeMillis() / 1000L).getBytes(StandardCharsets.UTF_8))).substring(0, 32);

			statement = conn.prepareStatement("INSERT INTO billing_addresses VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DEFAULT, DEFAULT)");
			statement.setString(1, billingId);
			
			// If we have a session ID, try to get the corresponding account ID
			if (String.valueOf(session.getAttribute("sid")) != null) {
				PreparedStatement accountStatement = conn.prepareStatement("SELECT accountId FROM sessions WHERE id = ?");
				accountStatement.setString(1, String.valueOf(session.getAttribute("sid")));
				ResultSet sessionAccount = accountStatement.executeQuery();
				
				if (sessionAccount.next()) {
					// If we have an account ID, add it to the query
					statement.setString(2, sessionAccount.getString("accountId"));
				} else {
					// Otherwise add an empty string
					statement.setString(2, "");
				}
			} else {
				// Otherwise add an empty string
				statement.setString(2, "");
			}
			
			// Just fill in the data
			statement.setString(3, requestObj.getString("title"));
			statement.setString(4, requestObj.getString("firstName"));
			statement.setString(5, requestObj.getString("lastName"));
			statement.setString(6, requestObj.getString("street"));
			statement.setString(7, requestObj.getString("zip"));
			statement.setString(8, requestObj.getString("city"));
			statement.setString(9, requestObj.getString("country"));
			statement.setString(10, requestObj.getString("email"));
			statement.setString(11, requestObj.getString("phone"));
			
			// If the update was successful, we return code 200 and the created billing ID
			if (statement.executeUpdate() > 0) {
				returnObj.put("code", 200);
				returnObj.put("billingId", billingId);
			}
		}

		// Close the connection, as always
		conn.close();

		// Print the JSON object
		out.println(returnObj);
	} catch (Exception e) {
		// If something bad happens, we print a JSON object
		// with code 500 and the error message
		e.printStackTrace();
		
		JSONObject returnObj = new JSONObject();
		
		returnObj.put("code", 500);
		returnObj.put("message", e.getMessage());
		out.println(returnObj);
	}
%>