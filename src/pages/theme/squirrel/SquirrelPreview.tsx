import { SquirrelColors, SquirrelLayouts } from "./SquirrelStore"

// (Rime AGRB[0xFFBBGGRR]) <<===>> (Web rgba[rgba(r,g,b,a)])
function convertColor(color: number): string {
  const a = ((color >> 24) & 0xff) / 0xff
  const b = (color >> 16) & 0xff
  const g = (color >> 8) & 0xff
  const r = color & 0xff
  return `rgba(${r},${g},${b},${a})`
}

type PreviewProps = {
  name: string
} & SquirrelLayouts &
  SquirrelColors

// const words = ["rime", "鼠须管", "Rime", "小狼毫", "中州韵rime输入法框架"]
const words = [
  {
    label: "1.",
    word: "鼠须管",
    comment: "(squirrel)",
  },
  {
    label: "2.",
    word: "鼠",
    comment: "(shu)",
  },
  {
    label: "3.",
    word: "须",
  },
  {
    label: "4.",
    word: "管",
  },
  {
    label: "5.",
    word: "📚",
  },
]

const SquirrelPreview = ({
  inline_preedit,
  candidate_list_layout,
  border_width,
  hilited_corner_radius,
  // borderHeight,
  spacing,
  corner_radius,
  line_spacing,
  base_offset,
  alpha,

  comment_font_point,
  font_point,
  label_font_point,
  ...colors
}: PreviewProps) => {
  const convertedColors = Object.fromEntries(
    Object.entries(colors)
      .filter(([key, value]) => {
        return key.endsWith("color") && typeof value === "number"
      })
      .map(([key, value]) => [key, convertColor(value as number)])
  )

  const {
    back_color,
    border_color,

    text_color,
    hilited_text_color,
    preedit_back_color,
    hilited_back_color,

    label_color,
    comment_text_color,
    candidate_back_color,
    candidate_text_color,

    hilited_candidate_back_color,
    hilited_candidate_text_color,
    hilited_candidate_label_color,
    hilited_comment_text_color,
  } = convertedColors

  const horizontal = candidate_list_layout === "linear"

  const { preeditText, preeditHilitedText, preeditCaret } = {
    preeditText: "输入法",
    preeditHilitedText: "shu ru fa",
    preeditCaret: "‸",
  }

  return (
    <div
      style={{
        boxSizing: "border-box",
        opacity: alpha,
        borderRadius: `${corner_radius}px`,
        outline: `${border_width}px solid ${border_color}`,
        boxShadow: `0 ${border_width}px ${border_width}px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ borderRadius: `${corner_radius}px`, overflow: "clip", backgroundColor: back_color }}>
        {!inline_preedit && (
          <div
            style={{
              display: "inline-flex",
              width: "100%",
              padding: `${corner_radius}px ${corner_radius}px ${spacing / 2 + 6}px`,
              backgroundColor: preedit_back_color,
              fontSize: font_point,
            }}
          >
            <div style={{ color: text_color }}> {preeditText}</div>
            <div
              style={{
                color: hilited_text_color,
                backgroundColor: hilited_back_color,
                borderRadius: `${hilited_corner_radius}px`,
              }}
            >
              {preeditHilitedText}
            </div>
            <div style={{ color: text_color }}>{preeditCaret}</div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: horizontal ? "row" : "column",
            justifyContent: "start",
            alignItems: "stretch",
            maxWidth: "560px",
            flexWrap: "wrap",
            borderRadius: `${inline_preedit ? corner_radius : 0}px`,
            paddingBottom: `${(horizontal ? 0 : 6) + corner_radius}px`,
            paddingTop: `${!inline_preedit ? spacing / 2 : corner_radius}px`,
            overflow: "clip",
          }}
        >
          {words.map((word, index) => {
            const first = index === 0
            const last = index === words.length - 1

            const gap = line_spacing / 2

            // 不是首尾, 并且是水平排列的候选词, 增加上  corner_raidus 或  gap
            const paddingLeft = first || !horizontal ? corner_radius : gap
            const paddingRight = last || !horizontal ? corner_radius : gap

            // 不是首尾, 并且是垂直排列的候选词, 增加上垂直方向的 gap
            const paddingTop = Math.max(-base_offset, 0) + (first || horizontal ? 0 : gap)
            const paddingBootom = Math.max(base_offset, 0) + (last || horizontal ? 0 : gap)

            return (
              <div
                key={index}
                style={{
                  display: "inline-flex",
                  paddingLeft: `${paddingLeft}px`,
                  paddingRight: `${paddingRight}px`,
                  paddingTop: `${paddingTop}px`,
                  paddingBottom: `${paddingBootom}px`,
                  alignItems: "baseline",
                  borderRadius: `${hilited_corner_radius}px`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    backgroundColor: first ? hilited_candidate_back_color : candidate_back_color,
                    left: -line_spacing,
                    right: 0,
                    top: first ? (inline_preedit ? -corner_radius : -spacing) : horizontal ? -corner_radius : 0,
                    bottom: -corner_radius * 2,
                    position: "absolute",
                    zIndex: 0,
                    display: hilited_corner_radius === 0 ? "block" : "none",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    backgroundColor: first ? hilited_candidate_back_color : candidate_back_color,
                    borderRadius: hilited_corner_radius,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 0,
                    display: hilited_corner_radius !== 0 ? "block" : "none",
                  }}
                />
                <div
                  style={{
                    zIndex: 2,
                    display: "flex",
                    alignItems: "flex-end",
                    color: first ? hilited_candidate_label_color : label_color,
                    paddingRight: `${label_font_point / 4}px`,
                    fontSize: label_font_point,
                  }}
                >
                  {index + 1}.
                </div>
                <div
                  style={{
                    zIndex: 2,
                    color: first ? hilited_candidate_text_color : candidate_text_color,
                    fontSize: font_point,
                    display: "flex",
                    alignItems: "flex-end",
                    lineHeight: "1",
                  }}
                >
                  {word.word}
                </div>
                <div
                  style={{
                    zIndex: 2,
                    color: first ? hilited_comment_text_color : comment_text_color,
                    fontSize: comment_font_point,
                    display: "flex",
                    alignItems: "flex-end",
                    lineHeight: "1",
                  }}
                >
                  {word.comment}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SquirrelPreview
