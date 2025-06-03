import { JSX, useEffect, useState } from "react"
import { ButtonMessageAdmin } from "../../../components/button/buttonMessageAdmin"
import { Information } from "../../../components/informations/information";
import { Participants } from "../../../components/informations/participants";
import { Results } from "../../../components/informations/results";
import { useLocation, useNavigate, useParams } from "react-router";
import { IMeeting } from "../../../requests/interfaces";
import { getMeetingForId } from "../../../requests/requests";

export const MessagePageAdmin = (): JSX.Element => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const [informationMeeting, setInformationMeeting] = useState<IMeeting | null>(null)

    const meetingId = location.state?.id || params.meetingID;

    const [currentType, setCurrentType] = useState<'information' | 'participants' | 'results'>(() => {
        const savedType = localStorage.getItem('informationType');
        return savedType as 'information' | 'participants' | 'results' || 'information';
    });

    useEffect(() => {
        if (!meetingId) {
            console.error("Meeting ID is missing");
            navigate('/admin');
            return;
        }

        localStorage.setItem('informationType', currentType);
        const getMeeting = async () => {
            try {
                const data = await getMeetingForId(Number(meetingId))
                setInformationMeeting(data);
            } catch (error) {
                console.error("Error fetching message:", error);
            }
        };
        getMeeting()
    }, [currentType, meetingId, navigate]);

    const handleButtonClick = (type: 'information' | 'participants' | 'results') => {
        setCurrentType(type);
    };

    const handleClickMessages = () => {
        navigate(-1)
    }

    return (
        <div className="w-[1016px] m-auto min-h-[280px]">
            <h1 className="text-[32px] text-(--color-text) mt-[26px] mb-[20px]">
                Информация о собрании
            </h1>{informationMeeting ?
                <>
                    <div className="mb-7 flex gap-7">
                        <ButtonMessageAdmin
                            title="Назад к собраниям"
                            onClick={() => handleClickMessages()}
                            isSelected={false}
                        />
                        <ButtonMessageAdmin
                            title="Информация"
                            onClick={() => handleButtonClick('information')}
                            isSelected={currentType === 'information'}
                        />
                        <ButtonMessageAdmin
                            title="Участники"
                            onClick={() => handleButtonClick('participants')}
                            isSelected={currentType === 'participants'}
                        />
                        <ButtonMessageAdmin
                            title="Общие результаты"
                            onClick={() => handleButtonClick('results')}
                            isSelected={currentType === 'results'}
                        />
                    </div>
                    <div className="mb-7">
                        {currentType === 'information' && <Information data={informationMeeting} />}
                        {currentType === 'participants' && <Participants
                            status={informationMeeting?.status || 0}
                            idMeeting={Number(meetingId)} />}
                        {currentType === 'results' && <Results endTime={new Date(informationMeeting?.vote_counting || '')} idMeeting={Number(meetingId)} />}
                    </div>
                </>
                : (<div className="flex justify-center items-center m-auto">
                    <div className="loader"></div>
                </div>)}
        </div>
    )
}