package interfaces;

import memberDto.UserDto;
import userData.Roles;
import userData.User;

public interface UserAccountManagement {
	public UserDto createAccount(User user);
	public void changeUserData();
	public void changeRole();
	public void changeUserName();
	public boolean validateRole(Roles role);
	public boolean validateMailAdress(String mailAdress);
}
