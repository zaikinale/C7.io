import { Link } from "react-router-dom"
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaUser, FaCalendar } from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { FaNoteSticky } from "react-icons/fa6";
import { RiTaskFill } from "react-icons/ri";

import { TiPinOutline } from "react-icons/ti";

export default function nav () {
    return (
        <nav className="">
            <Link to='/dashboard' className=""> 
                <TbLayoutDashboardFilled />
                <p className="">dashboard</p>
            </Link>
            <Link to='/calendar' className=""> 
                <RiTaskFill />
                <p className="">tasks</p>
            </Link>
            <Link to='/tasks' className=""> 
                <FaCalendar />
                <p className="">calendar</p>
            </Link>
            <Link to='/notes' className=""> 
                <FaNoteSticky />
                <p className="">notes</p>
            </Link>
            <Link to='/analytic' className=""> 
                <MdAnalytics />
                <p className="">analytic</p>
            </Link>
            <Link to='/profile' className=""> 
                <FaUser />
                <p className="">profile</p>
            </Link>
            <Link to='/settings' className=""> 
                <IoMdSettings />
                <p className="">settings</p>
            </Link>
        </nav>
    )
}