import HeaderBox from "@/components/HeaderBox"
import FamilyMembers from "@/components/FamilyMembers";
import { getFamily } from "@/lib/actions/family.actions"

const Family = async () => {

    const family = await getFamily();
    const loggedIn = { firstName: "Team8" }

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome to your family page,"
                        user={loggedIn?.firstName || 'Guest'}
                        subtext="Manage your family here. Add users by entering their email ID."
                    />
                    <div className="bg-bankGradient w-fit px-4 py-2 text-white cursor-pointer 
                                    hover:scale-105 duration-300 ease-out hover:text-black-1 
                                    rounded-lg">
                        + Add a Member
                    </div>
                    <hr />
                    <FamilyMembers members={family} />
                </header>
            </div>
        </section>
    )
}

export default Family