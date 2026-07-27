import { describe, expect, it } from "vitest";
import { peerReviewedPapers } from "@/data/peer-reviewed-papers";
import { getCitationText } from "@/lib/publication-citation";

describe("publication citations", () => {
  it("builds consistent plain-text references from the structured metadata", () => {
    expect(peerReviewedPapers.map(getCitationText)).toEqual([
      "Allcott, H., Gentzkow, M., Levy, R., et al. (2026). The effects of political advertising on Facebook and Instagram before the 2020 US election. Nature Human Behaviour, 10(5), 884–895. https://doi.org/10.1038/s41562-025-02328-w",
      "Guess, A. M., Malhotra, N., Pan, J., et al. (2023). How do social media feed algorithms affect attitudes and behavior in an election campaign? Science, 381(6656), 398–404. https://doi.org/10.1126/science.abp9364",
      "Allcott, H., Gentzkow, M., Mason, W., et al. (2024). The effects of Facebook and Instagram on the 2020 election: A deactivation experiment. Proceedings of the National Academy of Sciences, 121(21), e2321584121. https://doi.org/10.1073/pnas.2321584121",
      "Nyhan, B., Settle, J., Thorson, E., et al. (2023). Like-minded sources on Facebook are prevalent but not polarizing. Nature, 620(7972), 137–144. https://doi.org/10.1038/s41586-023-06297-w",
      "Guess, A. M., Malhotra, N., Pan, J., et al. (2023). Reshares on social media amplify political news but do not detectably affect beliefs or opinions. Science, 381(6656), 404–408. https://doi.org/10.1126/science.add8424",
      "Bergeron-Boutin, O., Nyhan, B., Settle, J., et al. (Forthcoming). Untrustworthy sources on Facebook and Instagram in 2020: Concentrated exposure but no attitudinal effects.",
    ]);
  });
});
