import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  XIcon,
  TwitterShareButton,
} from "react-share";
import { FaCheck } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { onLinkCopy } from "../../state/form/responseSlice";

const ResponseShared = ({
  size = 24,
  isRounded = true,
}: {
  size?: number;
  isRounded?: boolean;
}) => {
  const { isCopy } = useSelector(
    (state: RootState) => state.response.sharedInfo
  );
  const url = window.location.href;
  const dispatch = useDispatch();
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      dispatch(onLinkCopy(true));
      setTimeout(() => {
        dispatch(onLinkCopy(false));
      }, 3000);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={isCopy}
        onClick={handleCopyLink}
        className={`w-[24px] h-[24px] rounded-full flex justify-center items-center ${
          isCopy ? "bg-hot" : "bg-midnight"
        } text-white`}
      >
        {isCopy ? <FaCheck className="text-sm" /> : <FaLink />}
      </button>
      <EmailShareButton url={url}>
        <EmailIcon size={size} round={isRounded} />
      </EmailShareButton>
      <LineShareButton url={url}>
        <LineIcon size={size} round={isRounded} />
      </LineShareButton>
      <FacebookShareButton url={url}>
        <FacebookIcon size={size} round={isRounded} />
      </FacebookShareButton>
      <TwitterShareButton url={url}>
        <XIcon size={size} round={isRounded} />
      </TwitterShareButton>
    </div>
  );
};

export default ResponseShared;
