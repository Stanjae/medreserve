import { IconBabyCarriage, IconFriends, IconHeartbeat, IconLungs, IconUserCircle } from "@tabler/icons-react";
import Image1 from "../../../public/img3-1.png"
import Image2 from "../../../public/img3-2.png"
import Image3 from "../../../public/img3-3.png"

export const conditionData = [
    {title:"Common conditions", href:"/", icon:<IconLungs className=" size-12 "/>, 
        list:["cold & flu", "Urinary tract infection", "Sinus infections", "Pink eye", "bacterial infections", "STDs"]},
    {title:"Ongoing conditions", href:"/", icon:<IconLungs className=" size-12 "/>, 
        list:["Diabetes", "Hypertension", "Asthma", "depression", "Anxiety", "Thyroid Disorders"]},
    {title:"Everyday Treatments", href:"/", icon:<IconHeartbeat className=" size-12 "/>, 
        list:["PrEP", "Birth Control","Description", "hair Loss", "Prescription Refills", "mental Health"]}
]

export const pricingPlansData = [
    {title:"Personal", icon:<IconUserCircle className=" size-12 "/>},
    {title:"Children", icon:<IconBabyCarriage className=" size-12 "/>},
    {title:"Family", icon:<IconFriends className=" size-12 "/>}
]

export const onlinePrograms = [
    {title:"top doctors", image:Image1, href:"/", description:"All of our doctors are highly skilled and have a minimum of 15 years experience in U.S top healthcare institutions."},
    {title:"convinient", image:Image2, href:"/", description:"Book an appointment to video chat with the doctor of your choice from the ease of home using a smartphone."},
    {title:"affordable", image:Image3, href:"/", description:"Our pricing plans are quite affordable and you don’t have to wait in order to see a doctor in the time of urgency."}
]
