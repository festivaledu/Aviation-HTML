<%@ page contentType="application/json;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*" %>
<%@ page import="javax.sql.*" %>
<%@ page import="javax.naming.*" %>
<%@ page import="org.json.*" %>

<%!
	public JSONArray convertToJSON(ResultSet resultSet) throws Exception {
		JSONArray jsonArray = new JSONArray();
		while (resultSet.next()) {
			JSONObject obj = new JSONObject();
			int total_rows = resultSet.getMetaData().getColumnCount();
			for (int i = 0; i < total_rows; i++) {
				obj.put(resultSet.getMetaData().getColumnLabel(i + 1)
						.toLowerCase(), resultSet.getObject(i + 1));
			}
			
			jsonArray.put(obj);
		}
		return jsonArray;
	}
%>

<%
	try {
		InitialContext initialContext = new InitialContext();
		Context environmentContext = (Context)initialContext.lookup("java:/comp/env");
		DataSource dataSource = (DataSource)environmentContext.lookup("jdbc/aviation");
		Connection conn = dataSource.getConnection();
		
		JSONObject returnObj = new JSONObject();
		
		if (request.getParameter("query") != null && !request.getParameter("query").isEmpty()) {
			PreparedStatement statement = conn.prepareStatement("SELECT * FROM `airports` WHERE `name` LIKE ? OR `municipality` LIKE ? ORDER BY `name` ASC LIMIT 5");
			statement.setString(1, "%" + request.getParameter("query") + "%");
			statement.setString(2, "%" + request.getParameter("query") + "%");
			ResultSet results = statement.executeQuery();

			if (results.next()) {
				results.beforeFirst();
				returnObj.put("code", 200);
				returnObj.put("items", convertToJSON(results));
			} else {
				returnObj.put("code", 404);
				returnObj.put("items", new JSONArray());
			}
		}
		
		out.println(returnObj);
		conn.close();
	} catch (Exception e) {
		JSONObject returnObj = new JSONObject();
		
		returnObj.put("code", 500);
		returnObj.put("message", e.getMessage());
		
		out.println(returnObj);
	}
%>