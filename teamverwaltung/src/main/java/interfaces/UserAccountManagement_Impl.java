package interfaces;

import java.text.SimpleDateFormat;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import controller.ApiResponses;
import memberDto.UserDto;
import memberDto.UserDtoMapper;
import userData.Roles;
import userData.User;

public class UserAccountManagement_Impl implements UserAccountManagement {

	@Override
	public UserDto createAccount(User user) {
    // User in Datenbank schreiben	
		
	String timeStamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new java.util.Date());
	long id = Long.parseLong(timeStamp);
	
	return UserDtoMapper.toDto(id, user);
	}

	@Override
	public void changeUserData() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void changeRole() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void changeUserName() {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public boolean validateMailAdress(String mailAdress) {
		for (int i = 0; i < mailAdress.length(); i++) {
			
			if (mailAdress.charAt(i) == '.') {
				
				for (int j = i; j < mailAdress.length(); j++) {
					if(mailAdress.charAt(j) == '@') {
						return true;
					}
				}
			}
		}
		
		return false;
	}

	@Override
	public boolean validateRole(Roles roles) {
		if (roles == Roles.clanLeader || roles == Roles.teamLeader || roles == Roles.player || roles == Roles.coach || roles == Roles.analyst) {
		return true;
		}
		return false;
	}

}
