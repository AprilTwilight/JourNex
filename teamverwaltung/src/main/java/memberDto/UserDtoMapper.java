package memberDto;


import userData.User;

public class UserDtoMapper {
	
	public UserDtoMapper(long id, User user) {
		
	}
	
	
	public static UserDto toDto(long id, User user) {
        return new UserDto(
        	id,
        	user.getUserName(), 
        	user.getRole(),
        	user.getPersonData().getFirstName(),
        	user.getPersonData().getLastName(),
        	user.getPersonData().getMailAdress(),
        	user.getPersonData().getPhoneNumber()
        );
    }
}
