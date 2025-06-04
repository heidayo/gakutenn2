import Image from "next/image"

interface LogoProps {
  variant?: "full" | "icon" | "horizontal" | "vertical"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function Logo({ variant = "full", size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  // メインロゴアイコン（学の文字をモダンにデザイン）
  const LogoIcon = ({ size: iconSize = "md" }: { size?: string }) => (
    <div className={`${sizeClasses[iconSize as keyof typeof sizeClasses]} relative`}>
      <Image
        src="/images/gakuten-logo.png"
        alt="学転インターン"
        width={100}
        height={100}
        className="w-full h-full object-contain"
      />
    </div>
  )

  // バリエーション別のレンダリング
  if (variant === "icon") {
    return (
      <div className={className}>
        <LogoIcon size={size} />
      </div>
    )
  }

  if (variant === "horizontal") {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <LogoIcon size={size} />
        <span
          className={`font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent ${textSizeClasses[size]}`}
        >
          学転インターン
        </span>
      </div>
    )
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center space-y-2 ${className}`}>
        <LogoIcon size={size} />
        <span
          className={`font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent ${textSizeClasses[size]} text-center`}
        >
          学転
          <br />
          インターン
        </span>
      </div>
    )
  }

  // デフォルト（full）
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <LogoIcon size={size} />
      <span
        className={`font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent ${textSizeClasses[size]}`}
      >
        学転インターン
      </span>
    </div>
  )
}

// 特別なアニメーション付きロゴ
export function AnimatedLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-16 h-16 animate-pulse">
        <Image
          src="/images/gakuten-logo.png"
          alt="学転インターン"
          width={64}
          height={64}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  )
}

// ファビコン用の簡略化ロゴ
export function FaviconLogo() {
  return (
    <Image
      src="/images/gakuten-logo.png"
      alt="学転インターン"
      width={32}
      height={32}
      className="w-8 h-8 object-contain"
    />
  )
}