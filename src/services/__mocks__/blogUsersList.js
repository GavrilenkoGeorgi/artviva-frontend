const users = [
	{
		"blogs": [],
		"_id": "_test_id_5dfcda4e43b3bd1",
		"email": "longnamedale@longemaildot.com",
		"username": "Dale 'tester' Gribble",
		"id": "_test_id_5dfcda4e43b3bd1"
	},
	{
		"blogs": [],
		"_id": "5dfce28f7f7424367c5e5c1e",
		"email": "bobby@aol.com",
		"username": "Bobby Hill",
		"id": "5dfce28f7f7424367c5e5c1e"
	},
	{
		"blogs": [],
		"_id": "5dfce4a87f7424367c5e5c1f",
		"email": "gavrilenko.georgi@gmail.com",
		"username": "George",
		"id": "5dfce4a87f7424367c5e5c1f"
	},
	{
		"blogs": [],
		"_id": "5e023a913298240004fdc978",
		"email": "john@aol.com",
		"username": "John 'Default' Doe",
		"id": "5e023a913298240004fdc978"
	}
]

const getUsersList = () => {
	return Promise.resolve(users)
}

export default { getUsersList }
