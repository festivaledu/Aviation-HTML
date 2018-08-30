<%@ page contentType="application/json;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*" %>
<%@ page import="javax.sql.*" %>
<%@ page import="javax.naming.*" %>
<%@ page import="org.json.*" %>

<%!
	// This is a file that returns JSON data, so if we put this header at the very top, the application fails
	/**
	 * airport_lookup.jsp
	 * FESTIVAL Aviation
	 * 
	 * Search for airports using a query and
	 * return JSON data
	 * 
	 * @author Jonas Zadach (j.zadach@ostfalia.de)
	 * @version 1.0
	 */


	/**
	 * Convert a SQL ResultSet into JSON
	 * @param resultSet The result set to convert
	 * @return The converted JSON data
	 * @throws Exception An exception when converting the result set fails
	 */
	public JSONArray convertToJSON(ResultSet resultSet) throws Exception {
		// A ResultSet is like an array, so create a new JSON array
		JSONArray jsonArray = new JSONArray();
		
		// Iterate through all ResultSet items
		while (resultSet.next()) {
			// Create a new JSON Object for storing keys and values
			JSONObject obj = new JSONObject();
			
			// Iterate through every column of the item
			int total_columns = resultSet.getMetaData().getColumnCount();
			for (int i = 0; i < total_columns; i++) {
				// Put the column data into the JSON object
				// For some reason, SQL objects use indices starting at 1
				obj.put(resultSet.getMetaData().getColumnLabel(i + 1)
						.toLowerCase(), resultSet.getObject(i + 1));
			}
			
			// Put the item into the JSON array
			jsonArray.put(obj);
		}
		
		// Return the JSON array
		return jsonArray;
	}
%>

<%
	// Since we're working with SQL, wrap everything inside try/catch
	try {
		// Create a new database connection
		InitialContext initialContext = new InitialContext();
		Context environmentContext = (Context)initialContext.lookup("java:/comp/env");
		DataSource dataSource = (DataSource)environmentContext.lookup("jdbc/aviation");
		Connection conn = dataSource.getConnection();
		
		// Create a new JSON object so we can store our result data
		JSONObject returnObj = new JSONObject();
		
		// Check if the "query" parameter is usable
		if (request.getParameter("query") != null && !request.getParameter("query").isEmpty()) {
			// We're getting every airport matching an IATA (eg HAJ) or GPS code (eg EDDV) or
			// at max 5 airports matching a name (Hannover Airport) or municipality (Hannover)
			PreparedStatement statement = conn.prepareStatement("(SELECT * FROM `airports` WHERE `iata_code` = ? OR `gps_code` = ?) UNION (SELECT * FROM `airports` WHERE `name` LIKE ? OR `municipality` LIKE ? ORDER BY `name` ASC LIMIT 5)");
			
			// Set all the SQL query parameters
			statement.setString(1, request.getParameter("query"));
			statement.setString(2, request.getParameter("query"));
			statement.setString(3, "%" + request.getParameter("query") + "%");
			statement.setString(4, "%" + request.getParameter("query") + "%");
			ResultSet results = statement.executeQuery();

			// Check if we have any results, reset the selection index and return code 200
			if (results.next()) {
				results.beforeFirst();
				returnObj.put("code", 200);
				returnObj.put("items", convertToJSON(results));
			} else {
				// Else return code 404 and an empty JSON array
				returnObj.put("code", 404);
				returnObj.put("items", new JSONArray());
			}
		}
		
		// Close the database connection
		// THIS IS IMPORTANT, PEOPLE!
		conn.close();
		
		// Print the JSON object
		out.println(returnObj);
	} catch (Exception e) {
		e.printStackTrace();
		
		// If something bad happens, we print a JSON object
		// with code 500 and the error message
		JSONObject returnObj = new JSONObject();
		
		returnObj.put("code", 500);
		returnObj.put("message", e.getMessage());
		
		out.println(returnObj);
	}
%>