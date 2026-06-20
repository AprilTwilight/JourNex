package userData;

public class User {
	
	private String userName;
	private Roles role;
	private Person personData;
	
	public User(String userName, Roles role, Person personData){
		this.userName = userName;
		this.role = role;	
		this.personData = personData;
	}
	
	public Roles getRole() {
		return role;
	}
	public void setRole(Roles role) {
		this.role = role;
	}
	
	
	public Person getPersonData() {
		return personData;
	}
	
	
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
}
