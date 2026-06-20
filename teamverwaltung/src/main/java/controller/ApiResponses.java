package controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ApiResponses {
	 private ApiResponses() {
	    }

	    public static ResponseEntity<Map<String, String>> error(
	            HttpStatus status,
	            String error,
	            String message) {
	        return ResponseEntity.status(status).body(Map.of("error", error, "message", message));
	    }

	    public static ResponseEntity<Map<String, String>> notFound(String error, String message) {
	        return error(HttpStatus.NOT_FOUND, error, message);
	    }

	    public static ResponseEntity<Map<String, String>> badRequest(String error, String message) {
	        return error(HttpStatus.BAD_REQUEST, error, message);
	    }

	    public static ResponseEntity<Map<String, String>> conflict(String error, String message) {
	        return error(HttpStatus.CONFLICT, error, message);
	    }

	    public static ResponseEntity<Map<String, String>> unprocessable(String error, String message) {
	        return error(HttpStatus.UNPROCESSABLE_ENTITY, error, message);
	    }
	}

