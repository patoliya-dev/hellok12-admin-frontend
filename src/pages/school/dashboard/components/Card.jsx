import Icon from "../../../../components/AppIcon";
import { useNavigate } from "react-router-dom";

const Card = ({ cardData }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-elevated transition-smooth flex items-center gap-x-3 ${
        cardData?.isNavigate && "cursor-pointer"
      }`}
      onClick={() => {
        if (cardData?.isNavigate) {
          navigate(cardData?.navigateTo);
        }
      }}
    >
      <div
        className={`flex justify-center items-center rounded-lg w-12 h-12 ${cardData?.bgColor}`}
      >
        {cardData?.icon ? (
          <Icon name={cardData?.icon} size={24} color="white" />
        ) : (
          <cardData.iconComponent selected width={24} height={24} />
        )}
      </div>
      <div>
        <h5 className="text-2xl font-bold text-brand-gray-800">
          {cardData?.count}
        </h5>
        <p className="text-sm text-brand-gray-500">{cardData?.title}</p>
      </div>
    </div>
  );
};

export default Card;
