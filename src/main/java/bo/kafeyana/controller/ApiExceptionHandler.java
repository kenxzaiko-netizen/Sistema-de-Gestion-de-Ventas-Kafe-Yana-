package bo.kafeyana.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

/** Devuelve los errores de validación al JavaScript como JSON legible. */
@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> manejarError(ResponseStatusException ex) {
        String mensaje = ex.getReason() == null ? "Solicitud no válida" : ex.getReason();
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", mensaje));
    }
}
