interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

const Skeleton = ({ width = 'w-full', height = 'h-4', rounded = 'rounded-md', className = '' }: SkeletonProps) => {
  return <div className={`bg-gray-200 animate-pulse ${width} ${height} ${rounded} ${className}`} />;
};

export default Skeleton;
