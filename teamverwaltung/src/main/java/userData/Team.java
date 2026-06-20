package userData;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

public class Team {
	
	private Map <Roles, User> teamList = new HashMap();
	private String teamName;
	private File teamLogo;
	
	public Team(String teamName, List<User> teamMember) {
		for (int i = 0; i < teamMember.size(); i++) {
			teamList.put(teamMember.get(i).getRole(), teamMember.get(i));	
		}
	}
	
	
	
	
}
