package controller;

import java.text.SimpleDateFormat;

import org.apache.coyote.Request;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import interfaces.TeamManagement;
import interfaces.TournamentManagement;
import interfaces.UserAccountManagement;
import memberDto.UserDto;
import memberDto.UserDtoMapper;
import userData.Person;
import userData.User;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final UserAccountManagement accountManagement;
    private final TeamManagement teamManagement;
    private final TournamentManagement tournamentManagement;

    public AccountController(UserAccountManagement accountManagement, TeamManagement teamManagement, TournamentManagement tournamentManagement) {
        this.accountManagement = accountManagement;
        this.teamManagement = teamManagement;
        this.tournamentManagement = tournamentManagement;
    }

    @PostMapping("/createAccount")
    public ResponseEntity<?> createAccount(@RequestBody UserDto request) {
    	
      if (request.firstName() == null || request.firstName().isBlank()
                || request.lastName() == null || request.lastName().isBlank()
                || request.mailAdress() == null || request.mailAdress().isBlank()
                || request.phoneNumber() == null || request.phoneNumber().isBlank()
                || request.userName() == null || request.userName().isBlank()
                || request.role() == null) {
    	  return ApiResponses.badRequest("INVALID_REQUEST", "Pflichtfelder fehlen.");
      }
      	
      if (!accountManagement.validateRole(request.role())) {
    	  return ApiResponses.badRequest("INVALID_REQUEST", "Ungültige Rolle" );
      }

      if (!accountManagement.validateMailAdress(request.mailAdress())) {
    	  return ApiResponses.badRequest("INVALID_REQUEST", "Ungültige E-Mail-Adresse.");
      }
       
	    
      Person personData = new Person(request.firstName(), request.lastName(), request.mailAdress(), request.phoneNumber());
      UserDto dto = accountManagement.createAccount(new User(request.userName(), request.role(), personData));
        
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    
    
}
