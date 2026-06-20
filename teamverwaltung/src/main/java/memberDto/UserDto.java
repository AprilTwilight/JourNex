package memberDto;

import userData.Roles;

public record UserDto (
	 long id,
	 String userName, 
	 Roles role,
     String firstName,
     String lastName,
     String mailAdress,
     String phoneNumber
     ) 
{}
