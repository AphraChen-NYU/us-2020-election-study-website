import { describe, expect, it } from "vitest";
import { peerReviewedPapers } from "@/data/peer-reviewed-papers";
import { getCitationText } from "@/lib/publication-citation";

describe("publication citations", () => {
  it("builds consistent plain-text references from the structured metadata", () => {
    expect(peerReviewedPapers.map(getCitationText)).toEqual([
      "González-Bailón, S., Lazer, D., Barberá, P., et al. (2023). Asymmetric ideological segregation in exposure to political news on Facebook. Science, 381(6656), 392–398. https://doi.org/10.1126/science.ade7138",
      "Guess, A. M., Malhotra, N., Pan, J., et al. (2023). How do social media feed algorithms affect attitudes and behavior in an election campaign? Science, 381(6656), 398–404. https://doi.org/10.1126/science.abp9364",
      "Nyhan, B., Settle, J., Thorson, E., et al. (2023). Like-minded sources on Facebook are prevalent but not polarizing. Nature, 620(7972), 137–144. https://doi.org/10.1038/s41586-023-06297-w",
      "Guess, A. M., Malhotra, N., Pan, J., et al. (2023). Reshares on social media amplify political news but do not detectably affect beliefs or opinions. Science, 381(6656), 404–408. https://doi.org/10.1126/science.add8424",
      "Allcott, H., Gentzkow, M., Mason, W., et al. (2024). The effects of Facebook and Instagram on the 2020 election: A deactivation experiment. Proceedings of the National Academy of Sciences, 121(21), e2321584121. https://doi.org/10.1073/pnas.2321584121",
      "González-Bailón, S., Lazer, D., Barberá, P., et al. (2024). The diffusion and reach of (mis)information on Facebook during the U.S. 2020 election. Sociological Science, 11, 1124–1146. https://doi.org/10.15195/v11.a41",
      "Allcott, H., Gentzkow, M., Levy, R., et al. (2026). The effects of political advertising on Facebook and Instagram before the 2020 US election. Nature Human Behaviour, 10(5), 884–895. https://doi.org/10.1038/s41562-025-02328-w",
      "Appel, R. E., Kim, Y. M., Pan, J., et al. (2026). How deceptive online networks reached millions in the US 2020 elections. Nature Human Behaviour, 10(6), 1068–1082. https://doi.org/10.1038/s41562-026-02435-2",
      "Bergeron-Boutin, O., Nyhan, B., Settle, J., et al. (2026). Untrustworthy sources on Facebook and Instagram in 2020: Concentrated exposure but no attitudinal effects. Science Advances, 12(31), eadz6502. https://doi.org/10.1126/sciadv.adz6502",
      "Allcott, H., Gentzkow, M., Wittenbrink, B., et al. (Forthcoming). The effect of deactivating Facebook and Instagram on users’ emotional state. American Economic Journal: Economic Policy. https://doi.org/10.1257/pol.20240806",
      null,
    ]);
  });
});
