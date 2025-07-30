interface CommentBubbleProps {
  svgProps?: React.SVGProps<SVGSVGElement>;
  pathProps?: React.SVGProps<SVGPathElement>;
}

export default function CommentBubble({ svgProps, pathProps }: CommentBubbleProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      <path d="M12 8C8.68629 8 6 10.6863 6 14V46C6 49.3137 8.68629 52 12 52H20V64C20 65.1046 21.3431 65.6708 22.2071 64.9293L36.4142 52H68C71.3137 52 74 49.3137 74 46V14C74 10.6863 71.3137 8 68 8H12ZM14 16H66C67.1046 16 68 16.8954 68 18V42C68 43.1046 67.1046 44 66 44H35.5858C35.0533 44 34.5424 44.2107 34.1716 44.5858L26 52.5858V46C26 44.8954 25.1046 44 24 44H14C12.8954 44 12 43.1046 12 42V18C12 16.8954 12.8954 16 14 16Z" fill="#757575" {...pathProps} />
    </svg>
  );
}
